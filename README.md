# @mikosoft/csv
> Nodejs library which helps with CSV file management.

The library acts as a lightwight database with CSV files.


## Installation
```bash
$ npm install --save @mikosoft/csv
```


## Example

```js
/*** NodeJS script ***/
const CSV = require('@mikosoft/csv');

const func = async () => {

  const csvOpts = {
    filePath: './appended_arr.csv',
    encoding: 'utf8',
    mode: 0o644,

    fields: ['url', 'name', 'size'], // only these fields will be effective
    fieldDelimiter: ',',
    fieldWrapper: '"',
    rowDelimiter: '\n'
  };
  const csv = new CSV(csvOpts);

  const rows = await csv.readRows(false); // all types will be string
  // const rows = await csv.readRows(true); // or just csv.readRows()
  console.log('rows in total:: ', rows.length);
  console.log(JSON.stringify(rows, null, 4));
};

func().catch(console.error);
```



## API

#### constructor(opts) :void
```js
const CSV = require('csvman);

const opts = {
  filePath: './input.csv',
  encoding: 'utf8',
  mode: '0664',
  fields: ['url', 'name'], // define active CSV fields
  fieldDelimiter: ',',
  fieldWrapper: '"',
  rowDelimiter: '\n'
}
const csv = new CSV(opts);
```


#### async createFile() :void
Create CSV file defined in opts.filePath if it does not exist. If the file exists, it is NOT MODIFIED.

#### async addHeader() :void
Add fields into the CSV Header. Only if the file is empty.

#### async writeRows(rows:array) :void
Write multiple CSV rows. The rows argument is an array of objects.
CAUTION: Old content will be overwritten when this method is used.

#### async appendRows(rows:array) :void
Append multiple CSV rows. The rows argument is an array of objects.
New content will be added to the old content.

#### async readRows(convertType: boolean) :array
Read CSV rows and convert it in the array of objects.
If *convertType* is true then fields will convert the type automatically, for example string '5' will become number 5. The default is true.

#### async updateRows(query:object, doc:object, upsert:boolean) :{count:number, rows_updated: object[]}
Find CSV row by query and update it with doc.
The query is inspired by MongoDB queries so it can use.
```
$eq, $ne, $gt, $gte, $lt, $lte, $regex, $in, $exists

For example: {name: {$regex: /john/i}}
```
The doc is object whose properties are CSV fields.
If the upsert is true insert a new row if the rows are not found by the query.

#### async findRows(query) :object[]
Find CSV rows by the query. Use MongoDb inspired queries.

#### async removeRows(query) :object[]
Find and remove CSV rows by the query. Use MongoDb inspired queries.
The returned value is the array of removed row objects.

#### async extractFields() :array
Get fields array from the first (header) row.

#### fileExists() :boolean
Check if the CSV file defined in opts.filePath exists.



### License
The software licensed under [MIT](LICENSE).
