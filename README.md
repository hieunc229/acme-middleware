# acme-middleware - Free and Automated SSL certificate powered by Letsencrypt

acme-middleware helps generate free SSL powered by Letsencrpty. 
It is used as a library that wrap around expressjs application

## 1. Installation

1. You need to install `acme-middleware` modules using `npm` or `yarn`.

    ```js
    // For yarn
    $ yarn add acme-middleware
    // Or for npm
    $ npm install acme-middleware --save
    ```

2. Create default key and certificate, then update path to your config file (`ACME_EXPRESS_LOCAL_CERT` and `ACME_EXPRESS_LOCAL_KEY`)

    One way to create a default certificate is [generate a self-signed certificate](https://flaviocopes.com/express-https-self-signed-certificate/). For example, using `openssl`, use this command from Terminal or alternative from your OS:

    ```sh
    $ openssl req -nodes -new -x509 -keyout server.key -out server.cert
    ```

    Another way is to start your server, generate your first certificate, then update the path accordingly.

    _Note that since its is a self-signed certificate, it's will be invalid_


## 2. How to use

```js
import Acme from "acme-middleware";
import app from "./app"; // your express app

const acmeApp = new Acme(app);

let { http, https } = acmeApp.listen("host", 80, (otps: { port, host }) => {
    // this callback will be called 2 times
    // (1) when http server (your app) started and
    // (2) when a https server started
    console.log(`Server started at ${host}:${port}`);
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

## 4. Licenses

This library itself hold a MIT license. Besides, beware that it contains other libraries that hold diferent licenses.

Dependencies and its licenses:

- [acme-client](https://github.com/publishlab/node-acme-client): [MIT](https://github.com/publishlab/node-acme-client/blob/master/LICENSE)
- [acme-express-pouch-store](https://github.com/hieunc229/acme-express-pouch-store): [MIT, Apache 2.0](https://github.com/hieunc229/acme-express-pouch-store/tree/master/LICENSES)

## 5. Help and contribute

Feel free to [create an issue](https://github.com/hieunc229/acme-middleware/issues/new) to ask, give feedback and contribute

## 6. Donate

By using this library, you can save between $8-$900 per certificate a year, depending on the provider. If you are happy and want to donate, please either donate to [LetsEncrypt](https://letsencrypt.org/donate/) or any of charity that you want (preferably charity for helping children or people from poor area).

Please let me know if you donate (At the moment, I don't take donate for myself)