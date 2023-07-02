import { Collection, Db, Document, Filter, FindOptions, ObjectId, Sort } from "mongodb";
import { getDatabase } from "../../datasources/mongodb.js";
export class LessonCollection {
    constructor(
        public id: string,
        public name: string,
        public frequency: string,
    ) {};

    public static getLessonCollection = async (id: string): Promise<LessonCollection> => {
        const db: Db = getDatabase();
        const lessonCollections: Collection = db.collection('lessoncollections');

        const query: Filter<Document> = { 
            _id: new ObjectId(id) 
        };
        const options: FindOptions<Document> = {
            projection: {
                name: 1,
                frequency: 1
            }
        };

        const result = await lessonCollections.findOne(query, options);
        
        return new LessonCollection(
            result['_id'].toString(),
            result['name'],
            result['frequency']
        );
    }
    public static getLessonCollections = async (): Promise<LessonCollection[]> => {
        const db: Db = getDatabase();
        const lessonCollections: Collection = db.collection('lessoncollections');
        const result: LessonCollection[] = [];

        const query: Filter<Document> = { };
        const options: FindOptions<Document> = {
            projection: {
                name: 1,
                frequency: 1,
            }
        };

        const cursor = await lessonCollections.find(query, options);
        for await (const doc of cursor) {
            result.push(new LessonCollection(
                doc['_id'].toString(),
                doc['name'],
                doc['frequency']
            ));
        }
        
        return result;
    }

}