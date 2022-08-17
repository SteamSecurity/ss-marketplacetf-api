const axios = require('axios').default;

let MarketplaceTFAPI = {
	key: null,
	debug: false,
	cache_results: true,
	cache_time: 1800000,
	timeout: 5000,
	cache: {},
};
// --- Marketplace Functions -------------------------------
MarketplaceTFAPI.getProfile = (steamid64) => {
	return new Promise((resolve) => {
		if (!MarketplaceTFAPI.key) throw new Error('You do not have a Marketplace.TF API key set. See the documentation for more details.');

		checkCache()
			.then(() => _get(`https://marketplace.tf/api/Bans/GetUserBan/v2?key=${MarketplaceTFAPI.key}&steamid=${steamid64}`, steamid64))
			.then(errorCheck)
			.then(format)
			.then(cache)
			.then(presentToUser)
			.catch(presentToUser);

		function checkCache() {
			return new Promise((resolve, reject) => {
				_debuglog('Checking cache');
				if (MarketplaceTFAPI.cache[steamid64]) {
					_debuglog(`${steamid64} was in cache`, 'Cache');
					reject(MarketplaceTFAPI.cache[steamid64]);
				} else resolve(1);
			});
		}

		// Check for basic errors from the marketplacetf raw request
		function errorCheck(raw) {
			return new Promise((resolve, reject) => {
				_debuglog('Checking for errors');
				// Did the response resolve valid?
				if (!raw.response.success) return reject(_newResponseError(raw.response.error, '0'));

				// Note: When Marketplace.TF does not have a profile on a user, the 'results' will be blank.
				// This is an expected result, and it should be treated as a non-banned value, and a non-seller value. We will set that in the next step "format".

				return resolve(raw.response);
			});
		}

		function format(json) {
			return new Promise((resolve) => {
				_debuglog('Formatting');
				let profile_reputation = { banned: null, seller: null };

				json.results[0]?.banned ? (profile_reputation.banned = true) : (profile_reputation.banned = false);
				json.results[0]?.seller ? (profile_reputation.seller = true) : (profile_reputation.seller = false);

				// Stick the SteamID64 with the response when in debug mode
				if (MarketplaceTFAPI.debug) profile_reputation.steamid64 = steamid64;

				resolve(profile_reputation);
			});
		}

		function cache(data) {
			return new Promise((resolve) => {
				_debuglog('Adding to cache');

				MarketplaceTFAPI.cache[steamid64] = data;

				setTimeout(() => {
					delete MarketplaceTFAPI.cache[steamid64];
				}, MarketplaceTFAPI.cache_time);

				resolve(data);
			});
		}

		function presentToUser(data) {
			_debuglog('Resolve');
			resolve(data);
		}
	});
};

// --- Helper Functions ------------------------------------
function _get(url, steamid64) {
	return new Promise((resolve) => {
		_debuglog(`${steamid64} Making HTTP request`);
		axios
			.get(url, { timeout: this.timeout })
			.then((response) => {
				let status = response.status;
				let res = response.data;
				resolve({ status: status, response: res });
			})
			.catch((reason) => {
				resolve({ error: reason.response.status, error_message: reason.message });
			});
	});
}

function _newResponseError(message, error = 0) {
	return {
		error: error,
		error_message: message,
	};
}

// Our fun little debug logger function. Be nice to him! :3c
function _debuglog(data, title) {
	if (!MarketplaceTFAPI.debug) return;
	console.log(data);
}

module.exports = MarketplaceTFAPI;
