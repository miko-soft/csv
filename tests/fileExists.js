const CSV = require('../index.js');

const fja = async () => {

  const csvOpts = {
    filePath: './read.csv',
    encoding: 'utf8',
    mode: 0o644,

    fields: ['url', 'name', 'size'], // only these fields will be effective
    fieldDelimiter: ',',
    fieldWrapper: '"',
    rowDelimiter: '\n'
  };
  const csv = new CSV(csvOpts);

  const tf = await csv.fileExists();
  console.log('CSV file exists:: ', tf);
};

fja();
