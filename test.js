require('dotenv').config();
const marketplacetf = new (require('./index'))({ key: process.env.mptf, debug: true });

async function test() {
	// Initial request
	const one = await marketplacetf.getProfile('76561197996869097');
	console.log(one, '\n\n');
	if (!checkRequestErrors(one)) throw new Error('Failure');

	// Another user
	const two = await marketplacetf.getProfile('76561197973492506');
	if (!checkRequestErrors(two)) throw new Error('Failure');
	console.log(two, '\n\n');

	// A duplicate of the first request, check the cache!
	const three = await marketplacetf.getProfile('76561197996869097');
	if (!checkRequestErrors(three)) throw new Error('Failure');
	console.log(three, '\n\n');

	// A duplicate of the second request, check the cache!
	const four = await marketplacetf.getProfile('76561197973492506');
	if (!checkRequestErrors(four)) throw new Error('Failure');
	console.log(four, '\n\n');

	// Marketplace.TF banned user
	const five = await marketplacetf.getProfile('76561198092970200');
	if (!checkRequestErrors(five)) throw new Error('Failure');
	console.log(five, '\n\n');
}

function checkRequestErrors(response) {
	// Make sure our responses include banned, and seller.
	// Also make sure they are set to either a true or false value.
	if (response.banned !== true && response.banned !== false) return false;
	if (response.seller !== true && response.seller !== false) return false;
	return true;
}
test();
