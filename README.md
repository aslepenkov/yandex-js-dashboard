# yandex-js-dashboard

> Yandex JS Course. CodeWars challenges board 2019

![](images/table.png?raw=true)


## Build Setup

```bash

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
config
```javascript
module.exports = {
  playersEndpoint: "https://yandex-js-dashboard-api.firebaseapp.com/players",
  playersRealEndpoint:
    "https://yandex-js-dashboard-api.firebaseapp.com/playersReal",
  slugsEndpoint: "https://yandex-js-dashboard-api.firebaseapp.com/slugs",
  resultsEndpoint:
    "https://j3300l2mej.execute-api.eu-west-1.amazonaws.com/dev/",
  itemsEndpoint: "https://cleverpack.herokuapp.com/api/items"
};
```

## playersRealEndpoint ## 

```json
{
  "data": [
    {
      "real": "Алексей Слепенков",
      "nick": "4slepenkov"
    }
  ]
}
```

## slugsEndpoint ##
```json
{
  "data": [
    {
      "name": "how-good-are-you-really",
      "expiryDate": "Wed, 14 Aug 2019 19:00:00 GMT+0700",
      "startDate": "Wed, 31 Jul 2019 19:00:00 GMT+0700"
    }
  ]
}
```
## resultsEndpoint ##

```json
[   
    {
        "playerName": {
            "real": "Алексей Слепенков",
            "nick": "4slepenkov"
        },
        "doneCount": {
            "done": 22,
            "max": 22
        },
        "diffTime": "2.5k",
        "_cellVariants": {
            "lazy-repeater": "success"
        },
        "how-good-are-you-really": "+135:32",
    }
]
```
