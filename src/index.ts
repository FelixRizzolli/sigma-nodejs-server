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
import mongoose, { Mongoose } from 'mongoose';

import { LessonCollectionModel } from './models/Lessons/LessonCollection.js';

dotenv.config();
const db: Mongoose = await mongoose.connect(process.env.MONGODB_URI);

const typeDefs: GraphQLSchema = loadSchemaSync('./**/*.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const resolvers = {
  Query: {
    getLessonCollections: async () => {
      try {
        return LessonCollectionModel.find();
      } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch LessonCollections');
      }
    },
  }
};

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
  '/graphql',
  cors<cors.CorsRequest>(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);