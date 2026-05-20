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

### Iteration 4: High-Level components

- Vue components have been created inside `src/components`.
- `AnfrageCard.vue` is used inside `App.vue` for showing a `Anfrage` summary.
- `App.vue` is now using `Header.vue`, `Logo.vue`, and `AnfrageCard.vue` components for better structure.
- Styles specific to components have been moved from `styles.css` into their respective `<style scoped>` sections.
- Logic specific to components has been moved into their respective `<script setup>` sections.


### Iteration 5: Low-Level components

- Introduced some low-level reusable components:
  - `Button.vue`: A reusable button component with different variants (header, AnfrageCard).
  - `LogoAndTitle.vue`: reusable for different views.

### Iteration 6: Added Vue-Router and anfrage detail view

- Integrated Vue-Router as preparation to adding different views (`router/index.js`)
  - Important note: When hosting the app not under / on the server (as we are doing with GitHub Pages), `createWebHistory` must be provided with the app path!
  - also `main.js` must be imported relatively
- Updated `App.vue` to include `<router-view>` for rendering routed components.
- Created route `/` to `AnfragenView.vue` for the Anfrage listing page
- Added a new anfrage detail view that is linked from `AnfrageCard.vue` and can be accessed via `/anfrage/:id`.