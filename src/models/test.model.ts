import { Schema } from 'mongoose';
import { connectionMongo } from '../configs';

const TestSchema = new Schema({
  description: { type: String },
  title      : { type: String },
}, { timestamps: true });

const TestModel = connectionMongo.model('test', TestSchema);

export default TestModel;