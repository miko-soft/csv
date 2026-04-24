const CSV = require('../index.js');

/**
 * Demonstrates RFC 4180 double-quote escaping.
 * A " inside a field value must be written as "" so CSV parsers
 * can distinguish it from the field wrapper quotes.
 *
 * Field value written:  She said "hello"
 * Stored in CSV as:    "She said ""hello"""
 * Read back as:         She said "hello"
 */
const fja = async () => {
  const csvOpts = {
    filePath: './doubleQuoteEscape.csv',
    encoding: 'utf8',
    mode: 0o664,
    fields: ['id', 'quote'],
    fieldDelimiter: ',',
    fieldWrapper: '"',
    rowDelimiter: '\n'
  };
  const csv = new CSV(csvOpts);

  await csv.createFile();
  await csv.addHeader();

  const rows = [
    { id: 1, quote: 'She said "hello"' },
    { id: 2, quote: 'Both "open" and "close" quotes' },
    { id: 3, quote: 'No quotes here' },
  ];

  await csv.writeRows(rows);
  console.log('--- Written rows ---');
  rows.forEach(r => console.log(r));

  // Show raw file content so the "" escaping is visible
  const fse = require('fs-extra');
  const raw = await fse.readFile(csvOpts.filePath, 'utf8');
  console.log('\n--- Raw CSV file content ---');
  console.log(raw);

  // Read back and confirm round-trip
  const readBack = await csv.readRows(false);
  console.log('--- Read back rows ---');
  readBack.forEach(r => console.log(r));

  // Verify round-trip correctness
  let allMatch = true;
  rows.forEach((original, i) => {
    const match = String(original.id) === readBack[i].id && original.quote === readBack[i].quote;
    if (!match) {
      allMatch = false;
      console.error(`MISMATCH at row ${i}:`, original, readBack[i]);
    }
  });
  console.log('\nRound-trip OK:', allMatch);
};

fja().catch(console.error);
