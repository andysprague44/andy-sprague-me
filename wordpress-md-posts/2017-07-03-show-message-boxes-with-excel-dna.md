# Show Message Boxes with Excel-DNA
_Date: 2017-07-03 18:12:48_

Often a simple way to get user feedback is to show a pop-up message box.  Read on for a tutorial on how to do this.  As an example, this is the result we will get from this blog:

[![SimpleMessageBox](http://andysprague.com/wp-content/uploads/2017/07/image_thumb.png "SimpleMessageBox")](http://andysprague.com/wp-content/uploads/2017/07/image.png)

The second section of this blog deals with how to handle message boxes during asynchronous operations, as this is a little more involved.  All code examples can be found at: <https://github.com/andysprague44/excel-dna-examples/tree/master/MessageBox>

The below assumes a simple Excel-DNA project has been created as per my tutorial at: [https://andysprague.com/2017/02/03/my-first-custom-excel-ribbon-using-excel-dna/](https://andysprague.com/2017/02/03/my-first-custom-excel-ribbon-using-excel-dna/ "https://andysprague.com/2017/02/03/my-first-custom-excel-ribbon-using-excel-dna/")

## Simple Message Box

To achieve this in your Excel-DNA project there are several steps.

1. Add a class that displays the message box:

```
﻿using System;
using System.Windows.Forms;
using MsgBox = System.Windows.Forms.MessageBox;

public interface IExcelWinFormsUtil
{
    DialogResult ShowForm(Form form);
    DialogResult MessageBox(string text, string caption, MessageBoxButtons buttons, MessageBoxIcon icon);
}


public class ExcelWinFormsUtil : IExcelWinFormsUtil
{
    public DialogResult ShowForm(Form form)
    {
        return ShowModal(form.ShowDialog);
    }

    public DialogResult MessageBox(string text, string caption, MessageBoxButtons buttons, MessageBoxIcon icon)
    {
        return ShowModal(parentWindow => MsgBox.Show(parentWindow, text, caption, buttons, icon));
    }

    private static DialogResult ShowModal(Func dialogFunc)
    {
        var parentWindow = new NativeWindow()
        parentWindow.AssignHandle(ExcelDna.Integration.ExcelDnaUtil.WindowHandle);
      
        try
        {
            return dialogFunc(parentWindow);
        }
        finally
        {
            parentWindow.ReleaseHandle();
        }
    }
}
```

The critical line is `parentWindow.AssignHandle(ExcelDna.Integration.ExcelDnaUtil.WindowHandle);`.  Here we use Excel-DNA to get a reference to the Excel window, and then use this to display a message box within the context of excel (as a child window).

2. Next is to create an instance of this class when the add-in loads.  In the CustomRibbon.cs class:

```
public override string GetCustomUI(string ribbonId)
{
    _excel = new Application(null, ExcelDna.Integration.ExcelDnaUtil.Application);
    _excelWinFormsUtil = new ExcelWinFormsUtil();

    string ribbonXml = GetCustomRibbonXML();
    return ribbonXml;
}
```

And to make the form visible to the controller any action that requires message boxes can be run like this:

```
public void OnPressMe(IRibbonControl control)
{
    using (var controller = new ExcelController(_excel, _thisRibbon, _excelWinFormsUtil))
    {
        controller.PressMe();
    }
}
```

3. The last thing to do is to call it!  The below is called from the ExcelController.cs class but could be anywhere in your code-base:

```
public void PressMe()
{
    var dialogResult = _excelWinFormsUtil.MessageBox(
        "This is a message box asking for your input - write something?",
        "Choose Option",
        MessageBoxButtons.YesNoCancel,
        MessageBoxIcon.Question);

    switch (dialogResult)
    {
        case DialogResult.Yes:
          _excel.Range("A1").Value = "Yes chosen";
          break;
        case DialogResult.Cancel:
          _excel.Range("A1").Value = "Canceled";
          break;
        case DialogResult.No:
          _excel.Range("A1").Value = null;
          break;
    }
}
```

MessageBoxButtons contains the standard options, YesNo, OkCancel etc.

There are some changes to how excel itself handles windows from versions 2013 onwards but I have tested before and after so should work in most Excel versions (though no guarantees).

## Asynchronous Message Boxes

When calling message boxes from background threads things get a little tricky.  Excel is at heart a single threaded application, so any Excel COM interaction has to be *passed back to the main thread.* You’ll know when you’ve hit this problem if the focus returns to the wrong workbook after a message box is displayed, or there may be just a cryptic COM exception.

Excel-DNA provides help with this, which is to use the function *ExcelAsyncUtil.QueueAsMacro*.  This waits for the main thread to be free then runs the code that interacts with Excel, i.e if the user is editing a cell at the time the function is called, it will wait until editing is finished, and then and only then call the code.

However, if we want to show a message box in this workflow we often want to wait for user feedback i.e. YesNo, OkCancel.  the default method *does not block execution* so any code that uses a returned DialogResult will always use *DialogResult.None.*  This means we need to do some more work with the provided function.

I’ve implemented as an extension method that does this, add the following class to your application:

```
using System;
using System.Threading.Tasks;
using Application = NetOffice.ExcelApi.Application;
using ExcelDna.Integration;

namespace MessageBoxAddin.Extensions
{
    public static class ExcelDnaExtensions
    {
        /// 
        /// Run a function using ExcelAsyncUtil.QueueAsMacro and allow waiting for the result.
        /// Waits until excel resources are free, runs the func, then waits for the func to complete.
        /// 
        /// 
        /// var dialogResult = await excel.QueueAsMacroAsync(e =>
        ///     _excelWinFormsUtil.MessageBox("Message", "Caption", MessageBoxButtons.YesNo, MessageBoxIcon.Question) );
        /// 
        public static async Task QueueAsMacroAsync(this Application excel, Func func)
        {
            try
            {
                var tcs = new TaskCompletionSource();
                ExcelAsyncUtil.QueueAsMacro((x) =>
                {
                    var tcsState = (TaskCompletionSource)((object[])x)[0];
                    var f = (Func)((object[])x)[1];
                    var xl = (Application)((object[])x)[2];
                    try
                    {
                        var result = f(xl);
                        tcsState.SetResult(result);
                    }
                    catch (Exception ex)
                    {
                        tcsState.SetException(ex);
                    }
                }, new object[] { tcs, func, excel });
                var t = await tcs.Task;
                return t;
            }
            catch (AggregateException aex)
            {
                var flattened = aex.Flatten();
                throw new Exception(flattened.Message, flattened);
            }
        }
    }
}

```

Then to call, include the extensions class in your imports:

```
using static MessageBoxAddin.Extensions.ExcelDnaExtensions;
```

and call as in this example:

```
public void OnPressMeBackgroundThread(int delay)
        {
            Task.Factory.StartNew(
                () => RunBackgroundThread(delay),
                CancellationToken.None,
                TaskCreationOptions.LongRunning,
                TaskScheduler.Current
            );
        }
        public async Task RunBackgroundThread(int delay)
        {
            Thread.Sleep(delay*1000);
            
            //get user input as part of a background thread
            var dialogResult = await _excel.QueueAsMacroAsync(xl =>
                _excelWinFormsUtil.MessageBox(
                    "Message box called from background thread",
                    "Long Running Thread",
                    MessageBoxButtons.OKCancel,
                    MessageBoxIcon.Information)
            );

            //do stuff depending on dialog result in the background

            //finally, call back to excel to write some result
            ExcelAsyncUtil.QueueAsMacro(() =>
            {
                _excel.Range("A1").Value = dialogResult.ToString();
            });
        }
```

So what are we doing here?  By using a TaskCompletionSource we can force completion of the function before continuing using ‘await tcs.Task’.   This is turn means we can await the QueueAsMacroAsync function and do something with the MessageBox result.

[![AsyncMessageBox](http://andysprague.com/wp-content/uploads/2017/07/image_thumb1.png "AsyncMessageBox")](http://andysprague.com/wp-content/uploads/2017/07/image1.png)