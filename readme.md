# micro-express-starter

A starter we can use to start a project using express. This starter feature a very basic starting skeleton for an express project, specifying a listening port and starting endpoints (in `./src/api/index.ts`).

## Installation

You need to install [github-fetch-starter](https://github.com/vdegenne/github-fetch-starter.git) and invoke :

```bash
github-fetch-starter -n <project-name> micro-express-starter
cd <project-name>
```

(downloading the repository or the releases directly is not making sense because the starter is containing placeholders. `github-fetch-starter` makes sure to resolve these placeholders for you).


## Post-Installation

After the download. You have to install the dependencies (not included to make the release smaller).

```bash
yarn install
```

## Routes

You can start adding some routes to the application, just add them inside `./src/api/` (`example.router.ts` for an example on how to write them).
Then modify `./src/api/index.ts` to add the routes to the main api. The routers are just a good way to break and organise your api but if you wish you could directly add routes to the `api` object in `index.ts`.

## Tests

run `yarn test:watch` to start to watch for some changes. The tests go inside `./src/test` (see `api.test.ts`).

## Further

*Don't forget this readme is the readme of your project now so you have to remove all the content and replace with your application instructions*
