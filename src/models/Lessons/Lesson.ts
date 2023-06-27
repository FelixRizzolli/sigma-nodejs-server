import mongoose, { Schema, SchemaOptions } from 'mongoose';

enum LessonContentTypes {
    Quote = 'QUOTE',
    Paragraph = 'PARAGRAPH',
    UnorderedList = 'UNORDEREDLIST',
    OrderedList = 'ORDEREDLIST'
}

const lessonContentSchema = new Schema({
    _type: { 
      type: String, 
      required: true,
      enum: LessonContentTypes
    },
    quote: { type: String, required: false },
    source: { type: String, required: false },
    author: { type: String, required: false },
    paragraph: { type: String, required: false },
    intro: { type: String, required: false },
    list: { type: [String], required: false },
});


const lessonSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, require: true },
    title: { type: String, required: true },
    number: { type: Number, required: true },
    content: { type: [lessonContentSchema], required: false},
});

export const LessonModel = mongoose.model('Lesson', lessonSchema);
export const LessonContentModel = mongoose.model('LessonContent', lessonContentSchema);