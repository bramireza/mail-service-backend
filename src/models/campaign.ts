import { InferSchemaType, Schema, Document } from 'mongoose';
import { connectionNotificationsDB } from '../configs';
import { DataModel } from '../interfaces';

export const CampaignStatus = {
  Failed: 'FAILED',
  Send  : 'SEND'
};

const UserInfoSchema = new Schema({
  email    : { required: true, type: String },
  firstName: { required: true, type: String },
  lastName : { required: true, type: String },
}, { _id: false, timestamps: false });

const CampaignSchema = new Schema({
  emailBody      : { required: true, type: String },
  emailRecipient : { required: true, type: String },
  emailSender    : { required: true, type: String },
  emailSubject   : { required: true, type: String },
  sandbox        : { required: true, type: Boolean },
  serviceResponse: { type: Schema.Types.Mixed },
  status         : { 'enum': Object.values(CampaignStatus), type: String },
  templateName   : { required: true, type: String },
  userId         : { type: Schema.Types.ObjectId },
  userInfo       : UserInfoSchema
}, { timestamps: true });


export type Campaign = DataModel<InferSchemaType<typeof CampaignSchema>>

const CampaignModel = connectionNotificationsDB.model<Campaign & Document>('Campaign', CampaignSchema);

export default CampaignModel;