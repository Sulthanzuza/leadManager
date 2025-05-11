import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as XLSX from 'xlsx';
import { Lead } from './models/Leads.js';
import leadsRoutes from './routes/leads.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
const UPLOAD_DIR = process.env.UPLOAD_DIR || join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(' MongoDB connected'))
.catch(err => {
  console.error(' MongoDB connection error:', err.message);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR)); // Serve uploaded files if needed

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed'));
    }
  }
});

// Category helper
const commonCategories = [
  'technology', 'healthcare', 'finance', 'retail', 'manufacturing',
  'education', 'real estate', 'consulting', 'marketing', 'automotive'
];

const determineCategory = (lead) => {
  const searchText = `${lead.companyName} ${lead.additionalRequirements || ''}`.toLowerCase();
  return commonCategories.find(cat => searchText.includes(cat)) || 'others';
};

// Routes
app.use('/api/leads', leadsRoutes);

// Upload endpoint
app.post('/api/leads/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    fs.unlinkSync(req.file.path); // Clean up temp file

    const leadsToInsert = data.map(row => {
      const name = row.name || row.Name || '';
      const website = row.website || row.Website || '';
      const phoneNumber = row.phoneNumber || row.PhoneNumber || row['Phone Number'] || '';
      const email = row.email || row.Email || row['Email'] || '';

      if (!email && !phoneNumber) {
        return null; // Skip invalid rows
      }

      const lead = {
        name,
        companyName: row['Company Name'] || name,
        website,
        email,
        phoneNumber,
        address: row.address || row.Address || '',
        status: 'pending',
        category: row.category || row.Category || '',
        additionalRequirements: row.additionalRequirements || row.AdditionalRequirements || row['Additional Requirements'] || '',
        contactedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!lead.category) {
        lead.category = determineCategory(lead);
      }

      return lead;
    }).filter(Boolean); // Remove null entries

    if (leadsToInsert.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid leads found in the file' });
    }

    const savedLeads = await Lead.insertMany(leadsToInsert);

    res.status(200).json({ success: true, data: savedLeads });
  } catch (error) {
    console.error('Error uploading leads:', error);
    res.status(500).json({ success: false, message: 'Error processing file', error: error.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
