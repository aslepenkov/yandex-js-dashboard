# yandex-js-dashboard

[![CircleCI](https://circleci.com/gh/aslepenkov/yandex-js-dashboard.svg?style=svg)](https://circleci.com/gh/aslepenkov/yandex-js-dashboard)
[![Netlify Status](https://api.netlify.com/api/v1/badges/268b343a-da84-47b3-8cc9-2b258182cc13/deploy-status)](https://app.netlify.com/sites/yandex-js-dashboard/deploys)

> CodeWars results board. Yandex JS Course 2019

![](images/table.png?raw=true)

### Hosted on: https://yandex-js-dashboard.netlify.com

## Config (Custom Team/Custom Slugs)

- Run your server (https://github.com/aslepenkov/codewars-results-server)
- Set endpoint: config.js

```javascript
module.exports = {
  itemsEndpoint: "https://cleverpack.herokuapp.com/api/items"
};
```

## Build Setup

```bash

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# Run tests
npm run test

# Lint and fix files
npm run lint

# Run  end-to-end tests
npm run test:e2e

```
