import express from 'express';
import { getLeads, getLeadById, createLead, updateLead, deleteLead } from '../controllers/leadController.js';

const router = express.Router();

// Get all leads
router.get('/', getLeads);

// Get a single lead by ID
router.get('/:id', getLeadById);

// Create a new lead
router.post('/', createLead);

// Update a lead
router.put('/:id', updateLead);

// Delete a lead
router.delete('/:id', deleteLead);

export default router;