<div align="center">
  <img src="https://gitlab.com/steamsecurity/SS-MarketplaceTF-API/-/raw/master/images/marketplacetf-logo.png" width="750"><br>
  <b>A community made API Wrapper</b>
</div>
<br>
<div align="center">
  <img src="https://img.shields.io/npm/dt/ss-marketplacetf-api?style=for-the-badge">
  <img src="https://img.shields.io/gitlab/contributors/steamsecurity/ss-marketplacetf-api?style=for-the-badge">
  <img src="https://img.shields.io/gitlab/issues/open-raw/steamsecurity/ss-marketplacetf-api?style=for-the-badge">
  <img src="https://img.shields.io/gitlab/pipeline-status/steamsecurity/ss-marketplacetf-api?branch=master&style=for-the-badge">
</div>
<br>

# About

SS-MarketplaceTF-API is a basic wrapper for the Steam API used and maintained by SteamSecurity.org.
Please see [Limitations](#limitations) for further details.

### Installation

`npm i SS-MarketplaceTF-API`

# Basic usage

```js
// Assign module to a constant variable
const marketplacetf = require('ss-marketplacetf-api');

// Set MarketplaceTF Key
marketplacetf.key = MARKETPLACETF_API_KEY;

// Optionally set other variables
marketplacetf.debug = false; // Set to 'true' to enable debugging
marketplacetf.cache_results = true; // Set to 'false' to disable caching
marketplacetf.cache_time = 1800000; // Set to any amount of milliseconds to store cached responses
marketplacetf.timeout = 5000; // Set to any amount of milliseconds to wait for a response

// Send a request to marketplacetf to get the profile of a user by SteamID64
// Then log that to the console using console.log
marketplacetf.getProfile('STEAMID64').then(console.log);
```

See test_local.js for more examples.

# Properties

- ### key

  Set this value to your MarketplaceTF API Key.
  If left unset, this module will throw an error.

- ### timeout

  Time to wait in milliseconds before canceling the request and returning with an error.

- ### cache_results

  A Boolean dictating whether or not automatic caching happens. Typically you do not want to change from the default value 'true', however if you are using your own cache solution, you may want to disable this.

- ### cache_time

  Time to save a cached response in milliseconds.
  This is ignored if caching is disabled.

- ### cache

  This is an object containing the entire cache. This can be retrieved, changed, and then reapplied as needed.

- ### debug

  A Boolean controlling whether or not this module will run in debug mode. This is not recommended for production environments as it outputs a lot of text to the console window.

# Methods

- ### getProfile(steamid64)

  - steamid64: A valid steamid64 for any account.

    This returns a promise formatted as such:

    ```js
    {
      seller: Boolean,
      banned: Boolean
    }
    ```

# Error Handling

Any errors with the MarketplaceTF API or this module should resolve the promise with both an 'error' and 'error_message' value.

```js
{
	error: 'Status code. Typically "0"',
	error_message: 'A more specific error message'
}
```

# Limitations

This module does not handle the 'GetBots/v2' endpoint due to Marketplace.TF's strict policy of only allowing sellers access to that endpoint. We can not maintain that endpoint if we do not have access to it.

# Disclaimer

This module is still a work-in-progress. There may be breaking changes with every update. This will remain true until our v1.0.0 release. Subsequent releases will be much more mature.
This module is not endorsed or affiliated with Steam or Valve in any way.
This module is not endorsed or affiliated with Marketplace.TF in any way.
Please ensure your use of Marketplace.TF API is in line with the [Marketplace.TF Terms](https://marketplace.tf/terms).
