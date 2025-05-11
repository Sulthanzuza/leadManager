import { Lead } from '../models/Leads.js';

// Get all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leads', error: error.message });
  }
};

// Get a single lead by ID
export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching lead', error: error.message });
  }
};

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const leadData = req.body;
    if (!leadData.name || !leadData.companyName) {
      return res.status(400).json({ success: false, message: 'Name and company name are required' });
    }

    const newLead = await Lead.create(leadData);
    res.status(201).json({ success: true, data: newLead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating lead', error: error.message });
  }
};

// Update a lead
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedLead) return res.status(404).json({ success: false, message: 'Lead not found' });

    res.status(200).json({ success: true, data: updatedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating lead', error: error.message });
  }
};

// Delete a lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Lead not found' });

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting lead', error: error.message });
  }
};
