require('dotenv').config();
const { printTable, Table } = require('console-table-printer');
const marketplacetf = new (require('./index'))({ key: process.env.mptf, debug: true });

// A sample list of Steamid64s to check this API against
const sample_steamid64 = [
	'76561197996869097', // Seller, not banned
	'76561197973492506', // Not Seller, Not Banned
	'76561198090658171', // Not Seller, Not Banned
	'76561198092970200', // Not Seller, Banned
	'765611980521164051', // This one is an invalid SteamID64, but don't tell our tester function about that!
	'10101010101', // Same with this
	'76561197968633696', // Seller, Not Banned
	'76561198127443225', // Not Seller, Not Banned
];

let profile_table;

async function testProfiles() {
	// Build the table template to load data into
	profile_table = new Table({
		columns: [
			{ name: 'status', title: 'Status', alignment: 'center' },
			{ name: 'steamid64', title: 'SteamID64', alignment: 'center' },
			{ name: 'seller', title: 'Is Seller?', alignment: 'center' },
			{ name: 'banned', title: 'Is Banned?', alignment: 'center' },
		],
	});

	for (steamid64 of sample_steamid64) {
		await marketplacetf
			.getProfile(steamid64)
			.then((response) => addTableRow(profile_table, response))
			.catch((reason) => addTableRow(profile_table, reason));
	}
}

// A function to handle stylizing of the table row
function addTableRow(table, response) {
	// Defaults. Success!
	let color = 'green';
	let status = 'Good';

	// If there is an error, change the status and the color
	if (response.error_message) {
		color = 'yellow';
		status = 'Caught';
	}

	// Add the formatted row to the table
	table.addRow({ ...response, status: status }, { color: color });
}
testProfiles().then(() => profile_table.printTable());
