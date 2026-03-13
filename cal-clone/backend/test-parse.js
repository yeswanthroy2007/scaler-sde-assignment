const { parse } = require('date-fns');

const utcDate = new Date("2026-03-16T00:00:00Z");
const parsed = parse("18:00", "HH:mm", utcDate);

console.log('Reference (UTC):', utcDate.toISOString());
console.log('Parsed (Local):', parsed.toString());
console.log('Parsed (UTC):  ', parsed.toISOString());
