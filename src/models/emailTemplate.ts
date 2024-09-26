import { InferSchemaType, Schema, Document } from 'mongoose';
import { connectionNotificationsDB } from '../configs';
import { DataModel } from '../interfaces';

const EmailTemplateSchema = new Schema({
  htmlPart    : { required: true, type: String },
  templateName: { required: true,  type: String  },
}, { timestamps: true });


export type EmailTemplate = DataModel<InferSchemaType<typeof EmailTemplateSchema>>

const EmailTemplateModel = connectionNotificationsDB.model<EmailTemplate & Document>('EmailTemplate', EmailTemplateSchema);

export default EmailTemplateModel;