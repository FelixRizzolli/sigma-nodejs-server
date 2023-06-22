import mongoose, { Schema } from 'mongoose';

const lessonCollectionSchema = new Schema({
    name: { type: String, required: true },
    frequency: { type: String, required: true },
});

export const LessonCollectionModel = mongoose.model('LessonCollection', lessonCollectionSchema);
