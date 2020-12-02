# Free and Automated SSL certificate powered by Letsencrypt

`acme-middleware` helps generate free SSL powered by Letsencrypt. 
It is used as a library that wrap around your `expressjs` application

### Features

- [X] Free SSL powered by LetsEncrypt
- [X] HTTP Validation (HTTP-01) (automatically)
- [X] DNS Validation (DNS-01)

- [X] Wildcard SSL (documentation to be complete)
- [X] Domain management

- [ ] Automatically renew using cron job


## 1. Installation

1. You need to install `acme-middleware` modules using `npm` or `yarn`.

```js
// For yarn
$ yarn add acme-middleware
// Or for npm
$ npm install acme-middleware --save
```

_Note: This library need a storage to manage and check when to renew a certificate. By default, acme-middleware will use JSON file as storage. It will be fine if you have a small number of sites. Otherwise, you should you [acme-express-pouch-store](https://github.com/hieunc229/acme-express-pouch-store) for better performance._

2. Create default key and certificate, then update path to your config file (`ACME_EXPRESS_LOCAL_CERT` and `ACME_EXPRESS_LOCAL_KEY`)

One way to create a default certificate is [generate a self-signed certificate](https://flaviocopes.com/express-https-self-signed-certificate/). For example, using `openssl`, use this command from Terminal or alternative from your OS:

```sh
$ openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Another way is to start your server, generate your first certificate, then update the path accordingly.

_Note that since its is a self-signed certificate, it's will be invalid_

3. Create directories

```js
app.use("/.well-known/acme-challenge", express.static(path.join(ACME_EXPRESS_PATH, "acme-challenge")));
```

- Make sure working directory `ACME_EXPRESS_PATH` exists. The library will try to create directory itself if permited


## 2. How to use

```js
import AcmeExpress from "acme-middleware";
import exress from "express" // your express app

// Incase you install acme-express-pouch-storage
import AcmeExpressPouchStore from "acme-express-pouch-store";

const expressApp = express();
const pouchStore = new AcmeExpressPouchStore({ name: "myCertStore" });

// It is recomended to create AcmeExpress instance as soon as you create your express app
// to avoid acme-challenge handler being override
const acmeApp = new AcmeExpress({ 
    app: expressApp,
    store: pouchStore // optional
});

// Your app handlers goes down here
// app.get("/", ...)
// ....



const configs = {
    host: HOST, // "localhost", "0.0.0.0"
    port: PORT,
    httpsPort: 443
}

let { http, https } = acmeApp.listen(configs, (otps) => {
    // this callback will be called 2 times
    // (1) when http server (your app) started and
    // (2) when a https server started
    console.log(`Server started at ${opts.host}:${opts.port}`);
})
```

## 3. Enviroment variables

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

### `ACME_EXPRESS_LOCAL_CERT`: string
- Default value:  `/acme-express/certs/default/cert.pem`
- A default certificate, will be used when the library unable to load or create new certificate

### `ACME_EXPRESS_LOCAL_KEY`: string
- Default value:  `/acme-express/certs/default/key.pem`
- A default key, will be used when the library unable to load or create new key

Below is an example of a enviroment variables file

```js
// .env
ACME_EMAIL=hello@world.com
ACME_EXPRESS_PRODUCTION=true
ACME_EXPRESS_PATH=./safe/path

ACME_EXPRESS_LOCAL_CERT=./safe/path/default/localCert.pem
ACME_EXPRESS_LOCAL_KEY=./safe/path/default/localKey.pem
```

## 4. Using automate wildcard

On your browser, 

1. Visit `http://domain.com/_init-cert-wildcard` to initate the process
2. It will return some JSON data. You'll need to create TXT DNS valudate
    - Domain: use `domain` value (`_acme-challenge.domain.com`)
    - Value: use `keyAuthorization` in `dns-01` value
    Then wait for 5 mins and check the txt record if it show up on `_acme-challenge.domain.com` using `dig txt _acme-challenge.domain.com`
3. Visit `http://domain.com/_init-cert-wildcard?process=true` to confirm and get certificate
    - a. If it return `already_exists`, use `http://domain.com/_init-cert-wildcard?process=true&force=true`
    - b. If its keep waiting (not returning anything) and you have done 3a step, good chance the process is completed. Wait for 1 minute then visit `https://domain.com`.

**Renew (or regenerate) certificate**

Similar to the above steps, but added `force=true` to the URL. For example:
- `http://domain.com/_init-cert-wildcard?force=true`
- `http://domain.com/_init-cert-wildcard?force=true&process=true`

## 5. Licenses

This library itself hold a MIT license. Besides, beware that it contains other libraries that hold diferent licenses.

Dependencies and its licenses:

- [acme-client](https://github.com/publishlab/node-acme-client): [MIT](https://github.com/publishlab/node-acme-client/blob/master/LICENSE)
- [acme-express-pouch-store](https://github.com/hieunc229/acme-express-pouch-store): [MIT, Apache 2.0](https://github.com/hieunc229/acme-express-pouch-store/tree/master/LICENSES)

## 6. Help and contribute

Feel free to [create an issue](https://github.com/hieunc229/acme-middleware/issues/new) to ask, give feedback and contribute

## 7. Donate

By using this library, you can save between $8-$900 per certificate a year, depending on the provider. If you are happy and want to donate, please either donate to [LetsEncrypt](https://letsencrypt.org/donate/) or any of charity that you want (preferably charity for helping children or people from poor area).

Please let me know you donate by sending an email to hieunc(at)inverr.com!