import { LessonCollection } from "../models/Lessons/LessonCollection.js";
import { Lesson, LessonContentTypes } from "../models/Lessons/Lesson.js";

const resolvers = {
  Query: {
    getLessonCollection: (_, args) => {
      return LessonCollection.getLessonCollection(args['lessonCollectionId']);
    },
    getLessonCollections: async () => {
      return LessonCollection.getLessonCollections();
    },
    getLessons: async (_, args) => {
      return Lesson.getLessons(args['lessonCollectionId']);
    },
    getLessonByNumber: async (_, args) => {
      return Lesson.getLesson(args['lessonCollectionId'], args['lessonNumber']);
    }
  },
  LessonContent: {
    __resolveType(obj){
      switch (obj.type) {
        case LessonContentTypes.PARAGRAPH:
          return 'LessonParagraph';
        case LessonContentTypes.QUOTE:
          return 'LessonQuote';
        case LessonContentTypes.ORDEREDLIST:
        case LessonContentTypes.UNORDEREDLIST:
          return 'LessonList';
      }
      return null; // GraphQLError is thrown
    },
  },
};

export default resolvers;