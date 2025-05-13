# Syncing from DynamoDB to Redshift
_Date: 2023-12-08 20:13:41_

This blog lays out a low-cost approach to syncing incrementally (and/or running full exports) from DynamoDB table(s) to Redshift\*, using only S3 and AWS Lambda, with [Chalice](https://aws.github.io/chalice/) used as the framework for defining the application code, in python 3.9.

*\* you could probably switch this for another data warehouse like `clickhouse` without too much effort.*

## Send me the code!

As always, don't feel obliged to read, here is the code!

<https://github.com/andysprague44/dynamodb-to-redshift>

I'd suggest opening up the codebase as you read the below, as it will help understand what is going on. I'm not going to share any code snippets in the actual blog.

## Should I use it?

Sure, it's production ready! But not if you have any of the following considerations:

* Streaming use-cases, for this I'd suggest using `Amazon Kinesis Data Streams for DynamoDB` and `AWS Glue`. There is plenty of material out there if you look.
* Handling many schema migrations and other maintenance considerations, if you need this look at out-of-the-box data ETL solutions  
  like FiveTran, or move to an all-in solution like Databricks or Snowflake.
* Complex data transformations, for example breaking a list column in DynamoDB to multiple rows, I'd suggest adding `AWS Glue` if you need this.

## So, how does it work?

Follow along with the following, starting from the file *src/runtime/app.py*, where all the lamdba functions are actually defined. If you are not familiar with Chalice, that's ok, but you might want to come back to it: [Chalice](https://aws.github.io/chalice/)

There are 3 steps, each a lamdba function.

### 1. Export DynamoDB to S3

The first lamdba `export_to_s3` exports from each table you want to sync, either a FULL\_EXPORT or an INCREMENTAL\_EXPORT (both cases are handled, full export might be better suited for slowly moving dimension tables).

In the incremental export mode, it uses a file stored in s3 `last-export-time.txt`, which is written to at the end of the lambda run. The next scheduled run can read this and use as the start time for the next period, to ensure no data is lost. On first run, it only takes a 24 hour period, so you should always run a full export for a new table first.

Note, the lambda function returns immediately, but the export runs async from the dynamo DB side, and takes 5 plus minutes depending on table size. The export is ultimately complete when a file `manifest-summary.json` is written to s3.

### 2. Process in s3

The next lambda `redshift_manifest_creation`, listens for creation of this `manifest-summary.json`, and,

* a. pre-processes the data if required\*, and
* b. creates a `redshift.manifest` that redshift can use to ingest the data

This manifest file contains:

* a list of urls, which point to the data files to ingest, e.g.
* a jsonpaths object, that defines mapping between dynamodb nested json and the redshift table. Note, THE COLUMN ORDERS MUST MATCH.
* some additional meta-data required by our next lambda (i.e. the dynamodb table name, time format, is incremental)

\*- \*\* For INCREMENTAL\_EXPORT, there is a need to pre-process the files, so redshift can handle deletes, updates, and inserts gracefully\*\*

### 3. Import to Redshift

The next lambda `redshift_upsert` listens for the creation of the `redshift.manifest` file in step 1, and uses it to upsert data to redshift.

* For incremental export mode, it uses a MERGE operation.
* For full export mode, it replaces the contents of the target table.

---

**That's all folks!**