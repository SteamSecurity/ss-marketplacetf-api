const axios = require('axios').default;

let cache = {};

class MarketplaceTFAPI {
	constructor({ timeout = 5000, cache_time = 1800000, cache_results = true, key = null, debug = false } = {}) {
		if (!key) throw new Error('A Marketplace.TF API key must be supplied to use ss-marketplacetf-api');

		this.timeout = timeout;
		this.cache_time = cache_time;
		this.cache_results = cache_results;
		this.key = key;
		this.debug = debug;
	}

	getProfile(steamid64) {
		return new Promise(async (resolve) => {
			// Check for the saved user data in the cache
			this._debugLog({ data: 'Checking for user in cache' });
			if (cache[steamid64]) {
				this._debugLog({ data: `${steamid64} was in cache`, title: 'Cache' });
				return resolve(cache[steamid64]);
			}

			// User was not in the cache. Request information.
			const marketplacetf_response = await this._get(`https://marketplace.tf/api/Bans/GetUserBan/v2?key=${this.key}&steamid=${steamid64}`, steamid64);

			// Check the response for basic errors
			// NOTE: When Marketplace.TF does not have a profile on a user, the 'results' will be blank.
			// This is an expected result, and it should be treated as a non-banned value, and a non-seller value. We will set that in the next step "format".
			this._debugLog({ data: 'Checking response for errors' });
			if (!marketplacetf_response.response.success) return resolve(this._newResponseError(raw.response.error, '1'));

			// TODO: Error checks here
			// Format the response
			this._debugLog({ data: 'Formatting the response' });
			let profile_reputation = { banned: null, seller: null };
			marketplacetf_response.response.results[0]?.banned ? (profile_reputation.banned = true) : (profile_reputation.banned = false);
			marketplacetf_response.response.results[0]?.seller ? (profile_reputation.seller = true) : (profile_reputation.seller = false);
			if (this.debug) profile_reputation.steamid64 = steamid64; // Stick the SteamID64 with the response when in debug mode

			// Cache the response
			if (this.cache_results) {
				this._debugLog({ data: 'Caching the results' });
				cache[steamid64] = profile_reputation;

				// Delete the saved data after the set time
				setTimeout(() => {
					delete cache[steamid64];
				}, this.cache_time);
			}

			// Finished!
			resolve(profile_reputation);
		});
	}

	/**
	 * Our fun little debug logger function. Be nice to him! :3c
	 * @param {Object} [options]
	 * @param {String} [options.data] A message to send to the terminal.
	 * @param {String} [options.title] A header for the output. Disables 'type'.
	 * @param {String} [options.type=debug] The type of log to send.
	 * @returns
	 */
	_debugLog({ data, title, type = 'debg' } = {}) {
		if (!this.debug) return;

		if (title) {
			console.log(`-- ${title} -------------------------------------`);
			console.log(data);
			console.log(`\n\n`);
		} else {
			try {
				log[type](data);
			} catch {
				console.log(data);
			}
		}
	}
	// --- Helper Functions ------------------------------------
	_get(url, steamid64) {
		return new Promise((resolve) => {
			this._debugLog({ data: `${steamid64} Making HTTP request` });
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

	_newResponseError(message, error = '1') {
		return {
			error: error,
			error_message: message,
		};
	}
}
module.exports = MarketplaceTFAPI;
