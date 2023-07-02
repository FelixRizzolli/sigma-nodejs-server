import dotenv from 'dotenv';
import http from 'http';
import express, { json } from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLSchema } from 'graphql/type/schema';
import resolvers from './resolvers/resolvers.js';
import { connectToDatabase } from './datasources/mongodb.js';
import { error } from 'console';

dotenv.config();
const port = process.env.PORT || 3000;

const typeDefs: GraphQLSchema = loadSchemaSync('./**/*.graphql', {
  loaders: [new GraphQLFileLoader()]
});

interface MyContext {
  token?: String;
}

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  '/',
  cors<cors.CorsRequest>(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

connectToDatabase(async (error) => {
  if (!error) {
    await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}/`);
  }
});
