# Lead Management System

A comprehensive MERN stack application for managing sales leads. This system allows you to store, track, and manage business leads in one centralized location.

## Features

- Dashboard to view and manage all leads
- Upload leads in bulk from Excel or CSV files
- Add individual leads with detailed information
- Track lead status (pending, contacted, qualified, disqualified, customer)
- View detailed lead information and update lead status
- Responsive design for desktop and mobile use

## Project Structure

The project uses a MERN stack architecture:

- MongoDB (mock data initially)
- Express.js backend
- React with TypeScript frontend
- Node.js server

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

To start both frontend and backend together:

```bash
npm run dev:full
```

### Building for Production

```bash
npm run build
```

## Replacing Mock Data with MongoDB

Currently, the application uses mock data for demonstration. To connect to a real MongoDB database:

1. Install MongoDB locally or create a MongoDB Atlas account
2. Create a `.env` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
```

3. Update the server/controllers/leadController.js file to use MongoDB instead of mock data:

```javascript
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';

// Replace the existing functions with MongoDB operations
// For example:

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leads', error: error.message });
  }
};

// And so on for other controller functions
```

4. Create a Lead model in server/models/Lead.js:

```javascript
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  website: String,
  email: String,
  phoneNumber: String,
  address: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'qualified', 'disqualified', 'customer'],
    default: 'pending'
  },
  additionalRequirements: String,
  contactedBy: {
    type: String,
    enum: ['email', 'phone', 'meeting', 'other', null],
    default: null
  }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
```

5. Update server/index.js to connect to MongoDB:

```javascript
import mongoose from 'mongoose';

// Add this before your routes
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));
```

## License

MIT