# Express and Typescript skeleton
_Date: 2023-09-11 18:23:28_

This blog demonstrates an *opinionated* starter app for creating a REST API with Express and Typescript. It is *not a tutorial* but what I found was a lot of tutorials stop short of moving any code out of the index.js file, and that isn't going to scale. Here - I set out a sensible initial project structure that should allow code to be organized in a sensible manner as your app grows.

**What does it not have?** Authentication, middleware*.* Maybe I'll update this blog in the future to add them in. Or, my avid reader, raise a PR to the repo and I'll take a look!

Side note: please let me know if there is a tool or framework that you like that does this already to good effect. I tried Feathers, but it was way *too* opinionated for me.

## I just want the code

Go here if you want to see the answer's without taking the exam:

<https://github.com/andysprague44/rest-express-template>

## The structure

**index.ts**: The entrypoint to the app is index.ts, which is as lightweight as possible.

**app.ts**: The core definition of the application is moved to app.ts.

**src/routes/**: Each endpoint is moved to a new file in this folder and registered in app.ts.

**src/controller/:** The routes immediately defers to a controller. The controller routes the request to relevant service or services. Some business logic might sit in the controller but it should be kept to a minimum.

**src/services/:** The services handle an actual request and call to other dependencies e.g. the database.

And that's kind of it!

## How to run it

Follow through in the README, or:

```
npm install
npm run dev
```

The "npm run dev" command relies on a script in the package.json file, and actually runs: `ts-node index.ts`.

The server is now running on `http://localhost:3000`. You can now run API requests through the browser, e.g. [`http://localhost:3000/`](http://localhost:3000/users).

To query from postman, import the `RestExpressTemplate.postman_collection.json` file.

## Prisma

Optional - choose to ignore. However, Prisma is an ORM layer (sort of) that you can put on top of most types of databases. I'm not going to write about it here, so see <https://www.prisma.io/> for more.

## Docker

Also optional - the template has docker and docker-compose support.

```
docker build . -t rest-express-app
docker run -p 8080:8080 -d rest-express-app
```