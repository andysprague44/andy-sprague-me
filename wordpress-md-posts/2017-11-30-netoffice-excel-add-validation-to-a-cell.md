# NetOffice.Excel - Add Validation to a Cell
_Date: 2017-11-30 06:29:45_

My most recent blogs have been focused on Excel-DNA, and the pretty cool ability it brings to easily add your own custom ribbons.  This blog is looking at the other component of writing a C# app that can talk to Excel – namely NetOffice.Excel.
NetOffice.Excel provides the ability to interact with Excel COM elements, in a (mostly) painless way.  Think workbooks, worksheets, ranges, cells, read, write, format, copy… and pretty much all else you are able to do through Excel.
This blog will focus on the ability to create validation within a cell.  From excel, you can find that option here:

## [image](http://andysprague.com/wp-content/uploads/2017/11/image.png)

## Code

As always, feel free to dive straight into the code and take snippets at will.  you can find the full project at:
[https://bitbucket.org/andysprague44/netoffice.excel.extensions](https://bitbucket.org/andysprague44/netoffice.excel.extensions "https://bitbucket.org/andysprague44/netoffice.excel.extensions")
And the code for this blog:
[https://bitbucket.org/andysprague44/netoffice.excel.extensions/src/91d59b64a54fc0342064f5a529bf6f65685466da/NetOffice.Excel.Extensions/Extensions/CellValidationExtensions.cs?at=master&fileviewer=file-view-default](https://bitbucket.org/andysprague44/netoffice.excel.extensions/src/91d59b64a54fc0342064f5a529bf6f65685466da/NetOffice.Excel.Extensions/Extensions/CellValidationExtensions.cs?at=master&fileviewer=file-view-default "https://bitbucket.org/andysprague44/netoffice.excel.extensions/src/91d59b64a54fc0342064f5a529bf6f65685466da/NetOffice.Excel.Extensions/Extensions/CellValidationExtensions.cs?at=master&fileviewer=file-view-default")

## 

## 

## Getting set-up

In order to test out our application, I’d suggest getting immediately familiar with Excel-DNA, as this gives us a way to launch Excel from Visual Studio direct and gives us a way to see interactively what is going on.  Otherwise we’d be updating a closed excel worksheet, and you’d have to launch it after manually to see the impact.  And hey, nobody likes anything manual.  Follow this tutorial to get set-up with a Hello World application that we can use to test.
[https://andysprague.com/2017/02/03/my-first-custom-excel-ribbon-using-excel-dna/](https://andysprague.com/2017/02/03/my-first-custom-excel-ribbon-using-excel-dna/ "https://andysprague.com/2017/02/03/my-first-custom-excel-ribbon-using-excel-dna/")
If you already have an application that uses NetOffice.Excel but not Excel-DNA, then the code should still be relevant, you’ll just be on your own testing it out.

## Adding validation with a hard-coded list

If you are on this blog and know this one, but you’re getting errors with long lists, don’t panic, skip to the next section.
So essentially we are replicating:
[![image](http://andysprague.com/wp-content/uploads/2017/11/image_thumb1.png "image")](http://andysprague.com/wp-content/uploads/2017/11/image1.png)
Add this extension method to your project:

```
[sourcecode language="csharp" padlinenumbers="true"]
using System;
using System.Collections.Generic;
using System.Linq;
using NetOffice.ExcelApi;
using NetOffice.ExcelApi.Enums;

namespace NetOffice.Excel.Extensions.Extensions
{
public static class CellValidationExtensions
{
public static void AddCellListValidation(this Range cell, IList<string> allowedValues, string initialValue = null)
{
var flatList = allowedValues.Aggregate((x, y) => $"{x},{y}");
if (flatList.Length > 255)
{
throw new ArgumentException("Combined number of chars in the list of allowedValues can't exceed 255 characters");
}
cell.AddCellListValidation(flatList, initialValue);
}

private static void AddCellListValidation(this Range cell, string formula, string initialValue = null)
{
cell.Validation.Delete();
cell.Validation.Add(
XlDVType.xlValidateList,
XlDVAlertStyle.xlValidAlertInformation,
XlFormatConditionOperator.xlBetween,
formula,
Type.Missing);
cell.Validation.IgnoreBlank = true;
cell.Validation.InCellDropdown = true;
if (initialValue != null)
{
cell.Value = initialValue;
}
}
}
}
[/sourcecode]
```

Hopefully this should be easy enough to follow.  First, we aggregate the list to a comma separated string (which is the ‘Source’ or ‘formula’), then we call the cell.Validation method with some ugly excel settings rearing up.  More description of these in the documentation at
[https://msdn.microsoft.com/en-us/library/microsoft.office.interop.excel.validation.add(v=office.15).aspx?cs-save-lang=1&cs-lang=csharp#code-snippet-1](https://msdn.microsoft.com/en-us/library/microsoft.office.interop.excel.validation.add(v=office.15).aspx?cs-save-lang=1&cs-lang=csharp#code-snippet-1 "https://msdn.microsoft.com/en-us/library/microsoft.office.interop.excel.validation.add(v=office.15).aspx?cs-save-lang=1&cs-lang=csharp#code-snippet-1")
Then to test it:
1. Add a button in the custom ribbon to add cell validation (COMING SOON – right clicking on the cell can also provide this functionality)

```
[sourcecode language="xml"]
<group id="Group1" label="My Group">
<button id="Add Validation" label="Validate!" imageMso="FastForwardShort" size="large" onAction="OnAddValidation">
</group>
[/sourcecode]
```

2. Add this code to customRibbon.cs:

```
[sourcecode language="csharp"]
using static MyExcelAddin.CellValidationExtensions;
...

public void OnAddValidation(IRibbonControl control)
{
var allowedValues = new List<string> { "England", "30", "6", "Australia", "Equals", "Thrashing" };
((Worksheet)_excel.ActiveSheet).Range("A1").AddCellListValidation(allowedValues);
}
[/sourcecode]
```

Launch excel and Click the new button, and you should now see the cell validation in cell A1:
[![image](http://andysprague.com/wp-content/uploads/2017/11/image_thumb2.png "image")](http://andysprague.com/wp-content/uploads/2017/11/image2.png)
To change the error message displayed when invalid data is entered use:

```
[sourcecode language="csharp"]
cell.Validation.ErrorMessage = "No Chance";
[/sourcecode]
```

So we then get:
[![image](http://andysprague.com/wp-content/uploads/2017/11/image_thumb3.png "image")](http://andysprague.com/wp-content/uploads/2017/11/image3.png)

## 

## Cell Validation for long list

This method breaks down for long lists, are there is a limit of (I think) 255 chars for this length of the comma seperated list.  In this case all we can do is save the values to a range, and reference that to provide our cell validation.
Add this method to your CellValidationExtensions class:

```
[sourcecode language="csharp"]
public static void AddCellListValidation(this Range cell, Range allowedValuesRange, string initialValue = null)
{
var fullAddress = $"='{allowedValuesRange.Worksheet.Name}'!{allowedValuesRange.Address}";
cell.AddCellListValidation(fullAddress, initialValue);
}
[/sourcecode]
```

The difference here is that the formula/source is now referencing a range, rather than a hard-coded string.  Simples!
To test, change the method in CustomRibbon.cs to the following:

```
[sourcecode language="csharp"]
public void OnAddValidation(IRibbonControl control)
{
var allowedValues = new List<string> { "England", "30", "6", "Australia", "Equals", "Thrashing" };
var activeSheet = ((Worksheet)_excel.ActiveSheet);
var range = activeSheet.Range("A1:F1");
range.Value = allowedValues.ToArray();
activeSheet.Range("A2").AddCellListValidation(range);
}
[/sourcecode]
```

First, save the list to a range, then use this range to populate the validation.   In a real application you would probably want to create a hidden sheet, and save the allowed value list there, it works the same.
The result is this:
[![image](http://andysprague.com/wp-content/uploads/2017/11/image_thumb4.png "image")](http://andysprague.com/wp-content/uploads/2017/11/image4.png)
Now you know how to use NetOffice.Excel to add cell validation!   I’m always open to feedback, please comment what you think below.
Until next time.