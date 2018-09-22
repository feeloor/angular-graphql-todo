const express                 = require('express');
const bodyParser              = require('body-parser');
const http                    = require('http');
const { ApolloServer }        = require('apollo-server-express');
const { typeDefs, resolvers}  = require('./schema');
const { dbService }           = require('./services/db.service');
const cors                    = require('cors');

const app = express();
const db = dbService().start();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app });

const server = http.createServer(app);
server.listen(4000, () => {
  console.log('Listenening to port 4000');

  return db;
});
