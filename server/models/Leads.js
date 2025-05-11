
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  website: String,
  email: String,
  phoneNumber: String,
  address: String,
 status: { type: String, enum: ['pending', 'contacted', 'rejected', 'follow-up','success'], required: true },
  category: { type: String, default: 'others' },
  additionalRequirements: String,
 contactedBy: { type: String, enum: ['NAZEEB', 'MARIYAM', 'SULTHAN','YADHU', null] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Lead = mongoose.model('Lead', leadSchema);
