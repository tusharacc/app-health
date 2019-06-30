const sqlite3 = require('sqlite3').verbose();

insertIntoTable = async function(values) {
	let db = new sqlite3.Database('./apphealth.db');
	let insertQuery = `INSERT INTO tblAppHealth (source, region, message, datetime, severity, acknowledgement) VALUES (?,?,?,?,?,?)`
	db.run(insertQuery, values, function(err) {
		if (err) {
			throw err;
		}
		console.log(`A row has been inserted with rowid ${this.lastID}`);
		return true;
	});

	db.close();

}

selectFromTable = async function() {
	let db = new sqlite3.Database('./apphealth.db');
	let selQuery = "SELECT source, region, message, datetime, severity, acknowledgement FROM tblAppHealth";
	let rows;
	await db.all(selQuery, [], (err, row) => {
		if (err) {
			throw err;
		}
		db.close();
		rows = row;
		console.log(`The records returned are ${rows}`);
	});
	console.log(`Before return ${rows}`)
	return rows
}

module.exports = {
	insertIntoTable,
	selectFromTable
}
