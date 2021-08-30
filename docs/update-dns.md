# Updating DNS and generate certificate for wildcard domain

_If you came to this page through error "No DNSClient was provided", that means acme-middleware can't automatically create `txt` record to your domain. Do the following steps_

### 1. Create a record

1. Go to "yourdomain.com/___acme/widcard/info". Look for `keyAuthorization`
2. Log into your DNS manager. Create a txt record domain with:
    - name is `_acme-challange.yourdomain.com`
    - value is the `keyAuthorization` above

### 2. Check DNS

Go to "yourdomain.com/___acme/widcard/info". See if `data.verifyStatus.valid` is `true`.

If `data.verifyStatus.valid` is `false`. You need to make step 1 (create a record) is completed. Otherwise, wait for few minutes or hours to allow the new `txt` record applied.

### 3. Check order status

Go to "yourdomain.com/___acme/order". See if `data.status` is `ready` or `valid`.
Otherwise, wait for LetsEncrypt server to update your order status. It could take hours/days.

### 4. Create certificate

Before step 4, you need:
- `data.verifyStatus.valid` is `true` (in step 2)
- `data.status` is `ready` or `valid` (in step 3)

Then, go to "yourdomain.com/___acme/widcard/process". It could take a few minutes to complete. Once it's done, you'll receive `status: "ok"`

----

Open a new thread if you got any question or got stuck