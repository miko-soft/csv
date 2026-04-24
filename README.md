# @mikosoft/csv
> Node.js library for reading and writing CSV files as a lightweight database.


## Installation
```bash
npm install --save @mikosoft/csv
```


## Example

```js
const CSV = require('@mikosoft/csv');

const func = async () => {
  const csvOpts = {
    filePath: './data.csv',
    encoding: 'utf8',
    mode: 0o664,
    fields: ['url', 'name', 'size'],
    fieldDelimiter: ',',
    fieldWrapper: '"',
    rowDelimiter: '\n'
  };
  const csv = new CSV(csvOpts);

  await csv.createFile();
  await csv.addHeader();

  await csv.appendRows([
    { url: 'www.site1.com', name: 'Peter', size: 'M' },
    { url: 'www.site2.com', name: 'John',  size: 'L' },
  ]);

  const rows = await csv.readRows(); // convertType defaults to true
  console.log(rows.length, rows);
};

func().catch(console.error);
```


## Constructor Options

```js
const csv = new CSV({
  filePath: './input.csv',   // required — path to the CSV file
  encoding: 'utf8',          // optional, default: 'utf8'
  mode: 0o664,               // optional, default: 0o664 (octal number, not a string)
  fields: ['url', 'name'],   // required — defines column order and active fields
  fieldDelimiter: ',',       // optional, default: ','
  fieldWrapper: '"',         // optional, default: '' — character wrapping each field value
  rowDelimiter: '\n'         // optional, default: '\n'
});
```

- `fields` is required and defines which columns are read/written and in what order.
- `fieldWrapper: '"'` produces `"value"` cells; `fieldWrapper: ''` produces bare `value` cells.
- `mode` must be an **octal number** (e.g. `0o664`), not a string (`'0664'`).


## API

### `async createFile() :void`
Creates the CSV file at `filePath` if it does not exist. Parent directories are created automatically. If the file already exists it is **not modified**.

---

### `async removeFile() :void`
Deletes the CSV file if it exists. Does nothing if the file does not exist.

---

### `async addHeader() :void`
Writes the header row (derived from `fields`) to the file **only if the file is empty**. Call this after `createFile()`. If the file already has content the call is a no-op.

---

### `async writeRows(rows: object[] | any[][]) :void`
Overwrites the entire file (header + rows). `rows` can be:
- **Array of objects** — `[{ url: 'x.com', name: 'John' }, ...]` — keys must match `fields`.
- **Array of arrays** — `[['x.com', 'John'], ...]` — values must be in the same order as `fields`.

Extra keys/values beyond `fields` are silently ignored. Missing keys/values produce an empty cell.

> **Caution:** All previous file content is replaced.

---

### `async appendRows(rows: object[] | any[][]) :void`
Appends rows to the end of the file without touching existing content. Accepts the same `rows` formats as `writeRows`.

---

### `async readRows(convertType: boolean = true) :object[]`
Reads all data rows (skips the header) and returns an array of objects keyed by `fields`.

- When `convertType` is `true` (default), field values are automatically cast:
  - Integer string `'42'` → `42`
  - Float string `'3.14'` → `3.14`
  - `'true'` / `'false'` → `true` / `false`
  - Valid JSON string → parsed object
  - Everything else stays as a string.
- When `convertType` is `false`, all values are returned as strings.

---

### `async updateRows(query: object, doc: object, upsert?: boolean) :{ count: number, rows_updated: object[] }`
Finds rows matching `query` and updates them with the fields in `doc`.

- Only fields that already exist in a matched row are updated; extra fields in `doc` are ignored.
- `upsert: true` appends `doc` as a new row when no rows match the query.
- Returns `{ count, rows_updated }` where `count` is the number of rows changed.

---

### `async findRows(query?: object) :object[]`
Returns all rows matching `query`. Calling `findRows()` or `findRows({})` returns every row.

---

### `async removeRows(query?: object) :object[]`
Removes all rows matching `query` and returns them. Calling `removeRows()` or `removeRows({})` removes every row and returns all of them.

---

### `async extractFields() :string[]`
Reads the header row from the file and returns the field names as an array. Also updates `this.fields` in place. Useful when `fields` are unknown before reading.

---

### `fileExists() :boolean`
Synchronously returns `true` if the file at `filePath` exists, `false` otherwise.


## Query Operators

`findRows`, `removeRows`, and `updateRows` accept MongoDB-style queries:

```js
// Simple equality (shorthand)
{ name: 'John' }

// Explicit operators
{ name: { $eq:    'John' } }       // equal
{ name: { $ne:    'John' } }       // not equal
{ age:  { $gt:    25     } }       // greater than
{ age:  { $gte:   25     } }       // greater than or equal
{ age:  { $lt:    25     } }       // less than
{ age:  { $lte:   25     } }       // less than or equal
{ name: { $regex: /john/i } }      // regular expression
{ name: { $in: ['John', 'Mark'] } }// value is in array
{ col:  { $exists: false } }       // field existence check

// Combine conditions (AND)
{ url: 'example.com', age: { $gt: 18 } }
```

All conditions in the query object are combined with **AND**.


## License
The software is licensed under [MIT](LICENSE).
