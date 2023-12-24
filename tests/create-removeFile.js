const CSV = require('../index.js');

const fja = async () => {

  const csvOpts = {
    filePath: 'create-remove.csv',
    encoding: 'utf8',
    mode: 0o644,

    fields: ['url', 'name', 'age', 'obj'], // only these fields will be effective
    fieldDelimiter: ',',
    fieldWrapper: '',
    rowDelimiter: '\n'
  };
  const csv = new CSV(csvOpts);


  await csv.createFile();
  console.log('File create-remove.csv is created');

  await new Promise(r => setTimeout(r, 3400));

  await csv.removeFile();
  console.log('File create-remove.csv is removed');

};

fja();
