# My First Custom Excel-DNA Add-In (dotnet6 edition)
_Date: 2023-03-14 05:50:39_

This is an upgrade to my earlier blog "`My First Custom Excel Ribbon using Excel-DNA`", *now written for dotnet core*.

I add in Microsoft.Extensions support for *dependency injection*, *configuration*, and for *logging*, which should be an easy way to hook up to your app settings, plus quickly set-up your DI and logging frameworks of choice (e.g. <https://www.nuget.org/packages/Autofac.Extensions.DependencyInjection> & <https://www.nuget.org/packages/Serilog.Extensions.Logging>.

## Just want the code?

<https://github.com/andysprague44/excel-dna-azure-service-bus/tree/main/src/Skeleton.ExcelAddIn>.

## This is a short blog...

To get started, feel free to clone the project I link to above. This idea is that this is a skeleton project from which you can do what you want. For example, I wanted to call an Azure Service Bus to do some long running work (the other project in that solution, blog post coming soon!).

**Be sure to use Visual Studio** **>= 2022** - this is a strong recommendation, I have tried Rider and it doesn't fly.

## Dependency Injection

Should work out of the box - - register your dependencies in the class **ContainerOperations.cs.**

```
internal static class ContainerOperations
{
	//Excel needs some extras help in only registering dependencies once
	private static readonly Lazy ContainerSingleton = new(() => CreateContainer());
	public static IServiceProvider Container => ContainerSingleton.Value;

	//The DI registrations
	internal static IServiceProvider CreateContainer(string? basePath = null)
	{
		var container = new ServiceCollection();
		
		//register dependencies here...
        //e.g. container.AddSingleton();

		return container.BuildServiceProvider();
	}
}
```

If you want to add support for a more fully featured DI framework, `CreateContainer`  is the place to do so.

One thing of note is that Excel-DNA (or excel com, who knows) decides to try and call the `CreateContainer` method twice, so I wrapped in the Lazy singleton pattern to be defensive against this. I found out this when registering a dependency on something that *has* to be a singleton, and it was causing problems - in my case the Launch Darkly Client SDK (<https://launchdarkly.com/>).

## Logging

I implemented Serilog in this project. If you prefer another logging framework, change the method `ConfigureLogging` in the **ContainerOperations.cs** class. This should be all that is required!

From there logging is via the higher level Microsoft.Extensions.Logging API.

```
private static ILoggerFactory ConfigureLogging(IConfiguration configuration)
	{
		var config = configuration.GetSection("AppSettings");
		var appVersion = config["Version"] ?? "Unknown Version";
		var serilog = new Serilog.LoggerConfiguration()
			.ReadFrom.Configuration(config)
			.Enrich.WithProperty("AppName", "My.ExcelAddIn")
			.Enrich.WithProperty("AppVersion", appVersion)
			.CreateLogger();

		return new LoggerFactory(new[] { new SerilogLoggerProvider(serilog) });
	}
```

## Configuration / App Settings

**ContainerOperations.cs** is again the place where settings are initialized. This project uses the appsettings.json pattern to define (env specific) configuration. You can pass in the class `AppSettings` to the constructor of anything that needs it (see `ExcelController` for example). Nice!

```
basePath ??= ExcelDnaUtil.XllPathInfo?.Directory?.FullName ??
			throw new Exception($"Unable to configure app, invalid value for ExcelDnaUtil.XllPathInfo='{ExcelDnaUtil.XllPathInfo}'");
	
		IConfiguration configuration = new ConfigurationBuilder()
			.SetBasePath(basePath)
			.AddJsonFile("appsettings.json")
#if DEBUG
			.AddJsonFile("appsettings.local.json", true)
#endif
			.Build();

		var settings = configuration.GetSection("AppSettings").Get();
		if (settings == null)
			throw new Exception("No appsettings section found called AppSettings");

		container.AddSingleton(_ => settings);
```

## Where is the ribbon?

The CustomRibbon implementation is unchanged so feel free to refer to my original blog that set this up and re-use: [My First Custom Excel Ribbon using Excel-DNA](https://andysprague.com/2017/02/03/my-first-custom-excel-ribbon-using-excel-dna)

> **That's all folks!**