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
npm run dev
```

Look at [App.vue](src/App.vue) as a starting point for the app.

## Deploy

On merging to master, the app is built and released on [Vercel](https://vercel.com/). Since all release instructions are stored in the Vercel account you will not find any build instructions here.

If you want to deploy somewhere else you can run:

```shell
npm run build
```

And then deploy the `dist/` folder. Be mindful that the build generates files assuming deployment to the root folder of a domain so if you want to deploy to a subfolder, you will need to change the [public-base-path](https://vitejs.dev/guide/build.html#public-base-path).

## Roadmap

- Refactor into separate pages

## Dictionary / Credits

For the dictionary I am using a reparsed version of [apertium-fra-eng](https://github.com/apertium/apertium-fra-eng).

It is parsed using the `convert-dix.js` format and the jsonized dictionary is stored in `src/data/dictionary.ts`.