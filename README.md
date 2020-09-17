<h1 align="center">
  Vinlottis 🍾
</h1>

<div align="center">
  
  [![Build Status](https://drone.kevinmidboe.com/api/badges/KevinMidboe/vinlottis/status.svg)](https://drone.kevinmidboe.com/KevinMidboe/vinlottis)

</div>

<br/>

[**Vinlottis**](https://vinlottis.no) is the unofficial website for Knowit's wine-lottery, usually happening every friday at around 15:00.


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
