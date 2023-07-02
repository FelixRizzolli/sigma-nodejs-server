import { LessonCollection } from "../models/Lessons/LessonCollection.js";
import { Lesson } from "../models/Lessons/Lesson.js";

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
  }
};

export default resolvers;