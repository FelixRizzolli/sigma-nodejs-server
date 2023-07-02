import { Collection, Db, Document, Filter, FindOptions, ObjectId, Sort } from "mongodb";
import { getDatabase } from "../../datasources/mongodb.js";
export class Lesson{
    constructor(
        public id: string,
        public title: string,
        public lessonNumber: number,
        public content: (LessonParagraph | LessonQuote | LessonList)[] = [],
    ) {};

    public static getLesson = async (lessonCollectionId: string, number: number): Promise<Lesson> => {
        const db: Db = getDatabase();
        const lessons: Collection = db.collection('lessons');

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

        const document = await lessons.findOne(query, options);
        const lessonObject = new Lesson(
            document['_id'].toString(),
            document['title'],
            document['number'],
        );
        document['content'].map((contentObject) => {
            switch (contentObject._type) {
                case LessonContentTypes.PARAGRAPH:
                    lessonObject.content.push(
                        new LessonParagraph(
                            contentObject._type,
                            contentObject.paragraph
                        )
                    );
                    break;
                case LessonContentTypes.QUOTE:
                    lessonObject.content.push(
                        new LessonQuote(
                            contentObject._type,
                            contentObject.quote,
                            contentObject.author,
                            contentObject.source,
                        )
                    );
                    break;
                case LessonContentTypes.ORDEREDLIST:
                case LessonContentTypes.UNORDEREDLIST:
                    lessonObject.content.push(
                        new LessonList(
                            contentObject._type,
                            contentObject.intro,
                            contentObject.list
                        )
                    );
                    break;
            }
        });

        return lessonObject;
    }
    public static getLessons = async (lessonCollectionId: string): Promise<Lesson[]> => {
        const db: Db = getDatabase();
        const lessons: Collection = db.collection('lessons');
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

        const cursor = await lessons.find(query, options).sort(sort);
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

export enum LessonContentTypes {
    QUOTE = 'QUOTE',
    PARAGRAPH = 'PARAGRAPH',
    ORDEREDLIST = 'ORDEREDLIST',
    UNORDEREDLIST = 'UNORDEREDLIST',
}

export class LessonQuote {
    constructor(
        public type: string,
        public quote: string,
        public author: string,
        public source: string,
    ) {};
}
export class LessonParagraph {
    constructor(
        public type: string,
        public paragraph: string,
    ) {};
}
export class LessonList {
    constructor(
        public type: string,
        public intro: string,
        public list: string[],
    ) {};
}