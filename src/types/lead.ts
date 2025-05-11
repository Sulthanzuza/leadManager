export interface Lead {
  _id?: string;
  name: string;
  companyName: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  status: LeadStatus;
  category: string;
  additionalRequirements?: string;
  contactedBy?: ContactedBy;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = 'pending' | 'contacted' | 'rejected' | 'follow-up' | 'success';

export type ContactedBy = 'NAZEEB' | 'MARIYAM' | 'YADHU' | 'SULTHAN' | null;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}