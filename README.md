# frontend-glassfix

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

 Iteration 1: Static content

Made static product page from mock work as a Vue project:

- Source: index.html from static project
- Logo and CSS go into assets folder
- favicon goes to public folder
- index.html: link favicon, CSS and bootstrap JS
- App.vue: Main content goes here. Logo image link adapted.

### Iteration 2: GitHub Page deployment

- Added `.github/workflows/build-and-deploy.js.yml` to deploy as GitHub Page.
- Tweaked `vite.config.js` to use correct base URL - otherwise the JS files won't be loaded when hosted as a GitHub page.
- Added custom favicon

### Iteration 3: Dynamic product loading from local data

- Replaced static `Anfrage` cards with dynamic rendering using Vue's `v-for` from local `anfragen` array in data.js.
- `Anfragen` are displayed in a grid.
- "Details" button shows `Anfrage` description in an alert.
- Anfrage images, category, date, questions, desr´cription and ID are now populated from array data.
