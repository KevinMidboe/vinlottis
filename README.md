# vinlattis

[![Build Status](https://drone.kevinmidboe.com/api/badges/KevinMidboe/vinlottis/status.svg)](https://drone.kevinmidboe.com/KevinMidboe/vinlottis) [![Greenkeeper badge](https://badges.greenkeeper.io/KevinMidboe/vinlottis.svg)](https://greenkeeper.io/)

Prerequisits

```
mongodb
nodejs
npm
```


### Run dev

Since the backend and API runs separate from the Vue-on-save-compiler, when running the dev-server, the backend needs to be run separate

```
$ npm run dev
```

```
$ node server.js
```


### Run prod

```
$ npm run build && node server.js
```
