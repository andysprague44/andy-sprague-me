# Azure Table Storage - QueryAsync
_Date: 2020-12-04 00:33:28_

Quick one today. I have been playing around with Azure Table Storage using the "WindowsAzure.Storage" library in dotnet, and was failing to find anything useful on querying multiple rows. Using the 'TableContinuationToken' was a little confusing to me, and a lot of the example on the net are out of date (who knows, this may also be out of date by the time you read it!).

The below extension method works for at least WindowsAzure.Storage v9.3.3.

```
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;

/// 
/// Get rows from an Azure Storage Table.
/// 
/// type of entity, extending Microsoft.WindowsAzure.Storage.Table.TableEntity
/// the CloudTable, e.g. _tableClient.GetTableReference("table_name");
/// a TableQuery object, e.g. for filter, select
/// 
public static async Task> QueryAsync(
	this CloudTable table,
	TableQuery tableQuery) where TEntity : TableEntity, new()
{
	List results = new List();
	TableContinuationToken continuationToken = default;
	do
	{
		var queryResults = await table.ExecuteQuerySegmentedAsync(tableQuery, continuationToken);
		continuationToken = queryResults.ContinuationToken;
		results.AddRange(queryResults.Results);
	} while (continuationToken != null);

	return results;
}

```

And here is how to use it:

```
public class MyEntity : Microsoft.WindowsAzure.Storage.Table.TableEntity
{
    public string AnotherField { get; set; }
}

var storageAccount = CloudStorageAccount.Parse(connectionString);
var tableClient  = storageAccount.CreateCloudTableClient();
var table = tableClient.GetTableReference("table_name");

//To get all rows in a single partition
var tableQuery = new TableQuery().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "partitionKey"));
List results = await table.GetAsync(tableQuery);

//To get all rows
var tableQuery = new TableQuery();
List results = await table.GetAsync(tableQuery);

```

You can build up more complex queries using the TableQuery object, there is plenty of material that covers that, e.g.

That's all folks!