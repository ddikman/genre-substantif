# le genre de substantifs

Gender lookup for french words, in browser.

![Screencast](./example.gif)

There is also a small feature to practice common nouns.

![Practice](./practice.gif)

The app is hosted at [https://genre-substantif.vercel.app/](https://genre-substantif.vercel.app/)

You can also check out the [Figma project](https://www.figma.com/file/8teTdo1t85HnxdnGEQjYTn/What-the-Noun%3F?node-id=0%3A1) behind this app.

## Develop

The app is built on top of [ViteJs](https://vitejs.dev/) for quick local build and hot reload.

```shell
yarn run dev
```

Look at [App.vue](src/App.vue) as a starting point for the app.

### Vercel and API

The application also has some backend functionality which is hosted with the [vercel serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions). These can be foud in the `./api` folder.

If you want to run with vercel and using the vercel environment config, run `yarn vercel` and it will pull down what is needed and run both frontend and apis.

```
curl -X POST http://localhost:3000/api/request?word=bob
```

### Environment settings

There are two sets of environment variables, those prefixed with `VITE_` which are replaced compile-time by [Vite](https://vitejs.dev/guide/env-and-mode.html) for the client pages and others accessed by `process.env` in the `./api` functions. All of these are configured in `Vercel` and can be pulled down by running `vercel env pull`. Unfortunately, `vercel dev` doesn't support `env.local` so it is instead pulled down to `.env` which is why this file is not checked in as an example, instead look at [.env.example](./.env.example) for the environment variables used.

## Deploy

On merging to master, the app is built and released on [Vercel](https://vercel.com/). Since all release instructions are stored in the Vercel account you will not find any build instructions here.

If you want to deploy somewhere else you can run:

```shell
yarn build
```

And then deploy the `dist/` folder. Be mindful that the build generates files assuming deployment to the root folder of a domain so if you want to deploy to a subfolder, you will need to change the [public-base-path](https://vitejs.dev/guide/build.html#public-base-path).

## Server Side Generation (SSG)

To make sure the page loads quickly and renders nicely, I use SSG to pre-render the index page before serving to clients. This is similar to Server Side Rendering (SSR) but only happens build-time as opposed to rendering the page each time the client requests it.

As we have no dynamic data on the page, we don't need to render it every time.

However, this means that when we run `yarn dev`, there will be no server-side rendered version of the vue code, leading to a warning.

![SSR Warning](./ssr-warning.png)

This warning, in dev mode, can be safely ignored. But do make sure you build and try to serve the app using the pre-generated index.html as well to make sure there are no hydration issues happening on the production build.

This dev hydration issue could also be resolved by serving a rendered `index.html` when working locally according to [Vite's instructions](https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server) but I deemed this to be overkill for this project and that it is better to live with the warning.

## Roadmap

- Automatically add more entries to the dictionary using AI
- Fix the multiple-match by showing gender per word, not for the first match

## Dictionary / Credits

For the dictionary I am using a reparsed version of [apertium-fra-eng](https://github.com/apertium/apertium-fra-eng).

It is parsed using the `convert-dix.js` format and the jsonized dictionary is stored in `src/services/dictionary.ts`.
