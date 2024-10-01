import { Types } from 'mongoose';

export type ObjectIdString = string | Types.ObjectId

export type DataModel<T> = T & {
  _id: ObjectIdString;
}