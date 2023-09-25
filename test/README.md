# Demo server to integrate with CommonCheck API

## Generate RSA key pair

NOTE: Key size in bits should be at least 2048 (better 4096)

- [Reference to NodeJS docs](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypairsync_type_options) for generateKeyPairSync
- [Link to repo](https://github.com/rbrazhnyk/sign-and-verify-jwt) with example
- run in terminal (mac, linux):

```sh
ssh-keygen -t rsa -b 4096 -E SHA512 -m PEM -P "" -f RS512.key
openssl rsa -in RS512.key -pubout -outform PEM -out RS512.key.pub
```

## Install dependencies

Copy `.env-example` to `.env` and fill in the needed

NODE 14.x.x and NPM 7.x.x

```sh
npm install
```

## Start server

```sh
npm start
```
