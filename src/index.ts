import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLSchema } from 'graphql/type/schema';
import mongoose, { Mongoose } from 'mongoose';
import { LessonCollectionModel } from './models/Lessons/LessonCollection.js';

dotenv.config();
console.log(process.env.MONGODB_URI);

const typeDefs: GraphQLSchema = loadSchemaSync('./**/*.graphql', {
  loaders: [new GraphQLFileLoader()]
});

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
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

const db: Mongoose = await mongoose.connect(process.env.MONGODB_URI);
console.info(db);

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Server listening at: ${url}`);