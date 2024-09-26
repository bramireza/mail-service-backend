import { InferSchemaType, Schema, Document } from 'mongoose';
import { connectionAccountsDB } from '../../configs';
import { DataModel } from '../../interfaces';

const UserSchema = new Schema({
  email    : { required: true, type: String },
  firstName: { type: String  },
  lastName : { type: String  },
}, { timestamps: true });

export type User = DataModel<InferSchemaType<typeof UserSchema>>

const UserModel = connectionAccountsDB.model<User & Document>('user', UserSchema);

export default UserModel;