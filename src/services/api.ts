import axios from 'axios';
import type { Lead, ApiResponse } from '../types';

const API_URL = 'https://leadmanager-9dfm.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for offline fallback
const mockLeads: Lead[] = [];

export const fetchLeads = async (): Promise<Lead[]> => {
  try {
    const response = await api.get<ApiResponse<Lead[]>>('/leads');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return mockLeads;
  }
};

export const fetchLeadById = async (id: string): Promise<Lead> => {
  try {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching lead with ID ${id}:`, error);
    const lead = mockLeads.find(lead => lead._id === id);
    if (lead) return lead;
    throw new Error('Lead not found');
  }
};

export const createLead = async (leadData: Omit<Lead, '_id'>): Promise<Lead> => {
  try {
    const response = await api.post<ApiResponse<Lead>>('/leads', leadData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    const newLead: Lead = {
      ...leadData,
      _id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLeads.push(newLead);
    return newLead;
  }
};

export const updateLead = async (id: string, leadData: Partial<Lead>): Promise<Lead> => {
  try {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, leadData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating lead with ID ${id}:`, error);
    const index = mockLeads.findIndex(lead => lead._id === id);
    if (index !== -1) {
      mockLeads[index] = {
        ...mockLeads[index],
        ...leadData,
        updatedAt: new Date().toISOString(),
      };
      return mockLeads[index];
    }
    throw new Error('Lead not found');
  }
};

export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/leads/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting lead with ID ${id}:`, error);
    const index = mockLeads.findIndex(lead => lead._id === id);
    if (index !== -1) {
      mockLeads.splice(index, 1);
      return true;
    }
    return false;
  }
};

export const uploadLeadsFromExcel = async (file: File): Promise<Lead[]> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<Lead[]>>('/leads/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error uploading leads:', error);
    return [];
  }
};
