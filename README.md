# ACME Middleware — Free and Automated SSL certificate for Expressjs, powered by LetsEncrypt

<a href="https://www.npmjs.com/package/acme-middleware" target="_blank">
<img src="https://img.shields.io/npm/v/acme-middleware" alt="acme-middleware on NPM" />
</a>

`acme-middleware` helps generate free SSL powered by Letsencrypt.
It is used as a library that wrap around your `expressjs` application

### Features

- [x] Free SSL powered by LetsEncrypt
- [x] HTTP Validation (HTTP-01) (automatically)
- [x] DNS Validation (DNS-01)
- [x] Wildcard SSL (documentation to be complete)
- [x] Manage data with sqlite
- [x] Automatically renew using cron job

### Table of contents

- [1. Installation](#1-installation)
- [2. How to use](#2-how-to-use)
- [3. Request a certificate](#3-request-a-certificate)
- [4. Request a wildcard certificate](#4-request-wildcard-certificate)
- [5. Enviroment variables](#5-enviroment-variables)
- [6. APIs](#6-apis)
- [7. Licenses](#7-apis)
- [8. Changes](#8-changes)
- [Sponsors](#sponsors)

## 1. Installation

1. You need to install `acme-middleware` modules using `npm` or `yarn`.

```js
// For yarn
$ yarn add acme-middleware
// Or for npm
$ npm install acme-middleware --save
```

2. Setup enviroment `.env` in your main project. See section [3. Enviroment variables](#3-enviroment-variables) for example and more details.


## 2. How to use

See the following example

```js
import AcmeExpress from "acme-middleware";
import exress from "express"; // your express app

const expressApp = express();

// It is recomended to create AcmeExpress instance as soon as you create your express app
// to avoid acme-challenge handler being override
const acmeApp = new AcmeExpress({
  app: expressApp,

  /**
   * Path to database file. It uses sqlite database
   */
  // dbStore: "path/to/dbstore.db",

  /**
   * For wildcard domains.
   * Use DNS Client to create dns records automatically.
   * See https://github.com/hieunc229/acme-dns-client
   * */
  // dnsClient: new DNSClient(),
});

const configs = {
  host: HOST, // (optional, "localhost" by default) your host, i.e "localhost", "0.0.0.0"
  port: PORT, // (optional, 80 by default) your port, i.e 80, 8080
  httpsPort: 443, // (optional, must be 443)
};

let { http, https } = acmeApp.listen(configs, (otps) => {
  // this callback will be called 2 times
  // (1) when http server (your app) started and
  // (2) when a https server started
  console.log(`Server started at ${opts.host}:${opts.port}`);
});
```


## 3. Request a certificate

On your browser,

- To create, go to `http://domain.com/___acme/cert/create`
- Or to renew go to `http://domain.com/___acme/cert/renew`

Because `acme-express` has automatically complete the `http-01` acme challenge, you don't have to do anything else. It might take a few seconds to minutes to complete.


## 4. Request a widcard certificate

On your browser,

- To create, go to `http://domain.com/___acme/wildcard/create`
- Or to renew go to `http://domain.com/___acme/wildcard/renew`

_Note: in case you have multiple domains on the same server, and wanted to create the certificate for another domain, you `?domain=newdomain.com`. For example, `http://domain.com/___acme/wildcard/create?domain=newdomain.com`_

If you have a `DNSClient` properly setup, wait a few minutes and everything is done automatically.

But when either a `DNSClient` is not provided, or LetsEncrypt server take sometimes to verify your DNS changes. You'll need to wait to and try again to complete. See [Updating DNS and generate certificate for wildcard domain](/docs/update-dns.md) for more dtails.


## 5. Enviroment variables

The library use some variables as following:

### `ACME_EXPRESS_PATH`: string | undefined

- Where to store certificates, keysm and acme challenge files
- Default value: `./acme-express/certs`

### `ACME_EXPRESS_PRODUCTION`: `true`| `false` | undefined

- Production mode, if set to `true`, the library will request to production endpoint. Ortherwise, it will use staging endpoint
- Default value: `undefined`

### `ACME_EXPRESS_EMAIL`: string

- Email of maintainer. This email will be used to create a LetsEncrypt account
- Default value: `sample@notrealdomain.com`

### `ACME_EXPRESS_AUTH_KEY`: string

- Bearer key to for API authorization. If set, when using the APIs, use `Authorization: Bearer xxx` where xxx is the `ACME_EXPRESS_AUTH_KEY`. It's useful to protect your APIs from public access
- Default value: `undefined`

### `ACME_EXPRESS_ENABLE_EXPIRE_LIST`: `true` | `false` | undefined

- Set to `true` to enable `/___acme/expire` APIs
- Default value: `undefined`

Below is an example of a enviroment variables file

```js
// .env
ACME_EXPRESS_EMAIL=your@email.com
ACME_EXPRESS_AUTH_KEY=randomkey_for_auth_bearer
ACME_EXPRESS_PRODUCTION=false
ACME_EXPRESS_PATH=./acme-express/certs
ACME_EXPRESS_ENABLE_EXPIRE_LIST=false 
```


## 6. APIs

For wildcard certificate:

- `/___acme/wildcard/create`: Create wildcard certificate
- `/___acme/wildcard/renew`: Remove an existing and create a new wildcard certificate
- `/___acme/wildcard/process`: Create a wildcard certificate after created the `txt` DNS record and order status is ready (see [check order status)[/docs/update-dns.md#3-check-order-status])
  `/___acme/wildcard/info`: Get challenge info and dns txt record valid status
- `/___acme/wildcard/order`: Get order of the current request

Others:

- `/___acme/expire?date=yyyy-mm-dd`: Get a list of exired domain on or after `date`. If no `date` is given, `date` will be 30 days from now.

## 7. Licenses

This library itself hold a MIT license. Besides, beware that it contains other libraries that hold diferent licenses.

Dependencies and its licenses:

- [acme-client](https://github.com/publishlab/node-acme-client): [MIT](https://github.com/publishlab/node-acme-client/blob/master/LICENSE)

## 8. Changes

### v1.0

    - Use sqlite as the default database (remove external database option)
    - Added cron to checkup daily and automaticlly renew
    - Added `dnsClient` to create dns record automatically

### v0.9x

    - initiate version

Feel free to [create an issue](https://github.com/hieunc229/acme-middleware/issues/new) to ask, give feedback and contribute

##  Sponsors

<a href="https://inverr.com" target="_blank">
<img height="34" width="34" src="https://inverr.com/logo.svg" alt="Create a website with Inverr" />
Inverr — Nocode Site Builder
</a>

By using this library, you can save between $8-$900 per certificate a year, depending on the provider. If you are happy and want to donate, please either donate to [LetsEncrypt](https://letsencrypt.org/donate/) or any of charity that you want (preferably charity for helping children from underprivileged areas).

Please let me know you donate by sending an email to hieunc(at)inverr.com!
