import { Collection, Db, Document, Filter, FindOptions, ObjectId, Sort } from "mongodb";
import { getDatabase } from "../../datasources/mongodb.js";
export class Lesson{
    constructor(
        public id: string,
        public title: string,
        public lessonNumber: number,
        public content: []
    ) {};

    public static getLesson = async (lessonCollectionId: string, number: number): Promise<Lesson> => {
        const db: Db = getDatabase();
        const lessonCollections: Collection = db.collection('lessons');

        const query: Filter<Document> = { 
            'lessonCollection.id': new ObjectId(lessonCollectionId),
            'number': number
        };
        const options: FindOptions<Document> = {
            projection: {
                title: 1,
                number: 1,
                content: 1,
            }
        };

        const document = await lessonCollections.findOne(query, options);
        
        return new Lesson(
            document['_id'].toString(),
            document['title'],
            document['number'],
            document['content'],
        );
    }
    public static getLessons = async (lessonCollectionId: string): Promise<Lesson[]> => {
        const db: Db = getDatabase();
        const lessonCollections: Collection = db.collection('lessons');
        const result: Lesson[] = [];

        const query: Filter<Document> = {
            'lessonCollection.id': new ObjectId(lessonCollectionId),
        };
        const options: FindOptions<Document> = {
            projection: {
                title: 1,
                number: 1,
                content: 1,
            }
        };
        const sort: Sort = {
            'number': 1,
        };

        const cursor = await lessonCollections.find(query, options).sort(sort);
        for await (const document of cursor) {
            result.push(new Lesson(
                document['_id'].toString(),
                document['title'],
                document['number'],
                document['content'],
            ));
        }
        
        return result;
    }

}