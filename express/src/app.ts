import { createHandler } from "graphql-http/lib/use/express";
import { pgDataSource } from "./app-data-source";

import { userSchema } from "./user/user.schema";
import { GraphQLError } from "graphql";
import { roleWatchMiddleware } from "./middleware/role-watch.middleware";

const express       = require('express');
const { ruruHTML }  = require('ruru/server');

pgDataSource
  .initialize()
  .then(async () => {
    console.log("Data source has been intialized")
  })
  .catch((err) => {
    console.log(err.toString())
  })

const app = express();

app.use(express.json())
app.use(roleWatchMiddleware)

app.use(
  '/user', 
  createHandler({
    schema: userSchema,
    context: ({raw, body}) => ({
      user: raw['user'],
      body: body
    }),
  })
)

app.get('/', (_req: any, res: any) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/user' }));
});

app.listen(4000);
console.log("GraphQL server running")