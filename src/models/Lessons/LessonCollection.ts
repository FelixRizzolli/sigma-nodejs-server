import mongoose, { Schema } from 'mongoose';

const lessonCollectionSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, require: true },
    name: { type: String, required: true },
    frequency: { type: String, required: true },
});

export const LessonCollectionModel = mongoose.model('LessonCollection', lessonCollectionSchema);
