<h1 align="center">
  Vinlottis 🍾
</h1>

<div align="center">
  
  [![Build Status](https://drone.schleppe.cloud/api/badges/KevinMidboe/vinlottis/status.svg)](https://drone.schleppe.cloud/KevinMidboe/vinlottis)

</div>

<br/>

[**Vinlottis**](https://vinlottis.no) is a home-brewed solution for wine-lottery.


### Prerequisites
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
