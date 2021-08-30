# Free and Automated SSL certificate powered by Letsencrypt

`acme-middleware` helps generate free SSL powered by Letsencrypt.
It is used as a library that wrap around your `expressjs` application

### Features

- [x] Free SSL powered by LetsEncrypt
- [x] HTTP Validation (HTTP-01) (automatically)
- [x] DNS Validation (DNS-01)
- [x] Wildcard SSL (documentation to be complete)
- [x] Domain management
- [x] Automatically renew using cron job

### Table of contenst

- [1. Installation](#1-installation)
- [2. How to use](#2-how-to-use)
- [3. Create wildcard certificate](#3-create-wildcard-certificate)
- [4. Enviroment variables](#4-enviroment-variables)
- [5. APIs](#5-apis)
- [6. Licenses](#6-apis)
- [7. Changes](#7-changes)
- [Sponsors](#sponsors)

## 1. Installation

1. You need to install `acme-middleware` modules using `npm` or `yarn`.

```js
// For yarn
$ yarn add acme-middleware
// Or for npm
$ npm install acme-middleware --save
```

2. Configure enviroment `.env`

Make sure you have the following variables in your `.env` from your main project.
See section [3. Enviroment variables](#3-enviroment-variables) for example and more details.

---

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

---

## 3. Create widcard certificate

On your browser,

- To create, go to `http://domain.com/___acme/wildcard/create`
- Or to renew go to `http://domain.com/___acme/wildcard/renew`

_Note: in case you have multiple domains on the same server, and wanted to create the certificate for another domain, you `?domain=newdomain.com`. For example, `http://domain.com/___acme/wildcard/create?domain=newdomain.com`_

If you have a `DNSClient` properly setup, wait a few minutes and everything is done automatically.

But when either a `DNSClient` is not provided, or LetsEncrypt server take sometimes to verify your DNS changes. You'll need to wait to and try again to complete. See [Updating DNS and generate certificate for wildcard domain](/docs/update-dns.md) for more dtails.

---

## 4. Enviroment variables

The library use some variables as following:

### `ACME_EXPRESS_PATH`: string | undefined

- Default value: `/acme-express/certs`
- Where to store certificates, keysm and acme challenge files

### `ACME_EXPRESS_PRODUCTION`: `true`| `false` | undefined

- Default value: `undefined`
- Production mode, if set to `true`, the library will request to production endpoint. Ortherwise, it will use staging endpoint

### `ACME_EXPRESS_EMAIL`: string

- Default value: `sample@notrealdomain.com`
- Email of maintainer. This email will be used to create a Letsencrypt account

Below is an example of a enviroment variables file

```js
// .env
ACME_EXPRESS_EMAIL=your@email.com
ACME_EXPRESS_PRODUCTION=false # to use stagging or "true" to use production LetEncrypt API
ACME_EXPRESS_PATH=./acme-express/certs # where to store certs and database files
```

---

## 5. APIs

For wildcard certificate:

- `/___acme/wildcard/create`: Create wildcard certificate
- `/___acme/wildcard/renew`: Remove an existing and create a new wildcard certificate
- `/___acme/wildcard/process`: Create a wildcard certificate after created the `txt` DNS record and order status is ready (see [check order status)[/docs/update-dns.md#3-check-order-status])
  `/___acme/wildcard/info`: Get challenge info and dns txt record valid status
- `/___acme/wildcard/order`: Get order of the current request

Others:

- `/___acme/exire?date=yyyy-mm-dd`: Get a list of exired domain on or after `date`. If no `date` is given, `date` will be 30 days from now.

## 6. Licenses

This library itself hold a MIT license. Besides, beware that it contains other libraries that hold diferent licenses.

Dependencies and its licenses:

- [acme-client](https://github.com/publishlab/node-acme-client): [MIT](https://github.com/publishlab/node-acme-client/blob/master/LICENSE)

## 7. Changes

### v1.0

    - Use sqlite as the default database (remove external database option)
    - Added cron to checkup daily and automaticlly renew
    - Added `dnsClient` to create dns record automatically

### v0.9x

    - initiate version

Feel free to [create an issue](https://github.com/hieunc229/acme-middleware/issues/new) to ask, give feedback and contribute

## 8. Donate

By using this library, you can save between $8-$900 per certificate a year, depending on the provider. If you are happy and want to donate, please either donate to [LetsEncrypt](https://letsencrypt.org/donate/) or any of charity that you want (preferably charity for helping children from underprivileged areas).

Please let me know you donate by sending an email to hieunc(at)inverr.com!

##  Sponsors

<a href="https://inverr.com" target="_blank">
<img height="34" width="34" src="https://inverr.com/logo.svg" alt="Create a website with Inverr" />
Inverr — Nocode Site Builder
</a>