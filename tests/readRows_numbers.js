const CSV = require('../index.js');

const fja = async () => {

  const csvOpts = {
    filePath: 'readRows_numbers.csv',
    encoding: 'utf8',
    mode: 0o644,

    fields: ['field 1', 'field 2', 'field 3', 'field 4', 'field 5', 'field 6', 'field 7'], // only these fields will be effective
    fieldDelimiter: ',',
    fieldWrapper: '"',
    rowDelimiter: '\n'
  };
  const csv = new CSV(csvOpts);


  const rows = await csv.readRows(true);
  console.log('rows in total:: ', rows.length);
  console.log(JSON.stringify(rows, null, 4));
};

fja();
