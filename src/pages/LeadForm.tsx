import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lead, LeadStatus } from '../types/lead';
import { createLead, uploadLeadsFromExcel } from '../services/api';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface LeadFormProps {
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const LeadForm = ({ setLeads }: LeadFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showUpload = searchParams.get('upload') === 'true';
  
  const [formMode, setFormMode] = useState<'single' | 'upload'>(showUpload ? 'upload' : 'single');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Omit<Lead, '_id'>>({
    name: '',
    companyName: '',
    website: '',
    email: '',
    phoneNumber: '',
    address: '',
    status: 'pending',
    additionalRequirements: '',
    contactedBy: null,
  });

  useEffect(() => {
    // Update formMode when URL changes
    setFormMode(showUpload ? 'upload' : 'single');
  }, [showUpload]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newLead = await createLead(formData);
      setLeads(prev => [newLead, ...prev]);
      toast.success('Lead added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast.error('Please select an Excel or CSV file');
      return;
    }
    
    setExcelFile(file);
    
    // Parse the file for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        // Limit preview to first 5 rows
        setPreviewData(json.slice(0, 5));
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error('Error parsing file. Please check the file format.');
      }
    };
    
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = async () => {
    if (!excelFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const uploadedLeads = await uploadLeadsFromExcel(excelFile);
      setLeads(prev => [...uploadedLeads, ...prev]);
      toast.success(`Successfully imported ${uploadedLeads.length} leads!`);
      navigate('/');
    } catch (error) {
      console.error('Error uploading leads:', error);
      toast.error('Failed to upload leads. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div>
            <h1 className="text-lg font-medium leading-6 text-gray-900">
              {formMode === 'single' ? 'Add New Lead' : 'Import Leads from Excel'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {formMode === 'single' 
                ? 'Add a new lead to your database'
                : 'Upload an Excel file with lead information'
              }
            </p>
          </div>
          
          <div className="border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setFormMode('single');
                  navigate('/leads/new'); // Remove the upload parameter
                }}
                className={`pb-4 text-sm font-medium border-b-2 ${
                  formMode === 'single'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-150`}
              >
                Add Single Lead
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormMode('upload');
                  navigate('/leads/new?upload=true');
                }}
                className={`pb-4 text-sm font-medium border-b-2 ${
                  formMode === 'upload'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-150`}
              >
                Bulk Upload
              </button>
            </div>
          </div>
          
          {formMode === 'single' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="companyName" className="label">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="label">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="label">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="rejected">Rejected</option>
                    <option value="follow-up">Follow Up</option>
                    <option value="success">Success</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="label">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              
              <div>
                <label htmlFor="additionalRequirements" className="label">
                  Additional Requirements
                </label>
                <textarea
                  name="additionalRequirements"
                  id="additionalRequirements"
                  rows={3}
                  value={formData.additionalRequirements || ''}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-outline mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary-500 transition-colors duration-150"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Excel or CSV files only
                  </p>
                </div>
              </div>
              
              {excelFile && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900">Selected file:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setExcelFile(null);
                        setPreviewData([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{excelFile.name}</p>
                  
                  {previewData.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Preview of first 5 records:</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                          <thead className="bg-gray-100">
                            <tr>
                              {Object.keys(previewData[0]).map((key) => (
                                <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {previewData.map((row, i) => (
                              <tr key={i}>
                                {Object.values(row).map((value, j) => (
                                  <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-600">
                                    {String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">File Format Instructions:</h3>
                <p className="text-sm text-gray-600">
                  Excel file should include these columns (not all are required):
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li><strong>name</strong> - Full name of the lead (required)</li>
                  <li><strong>companyName</strong> - Company or organization name (required)</li>
                  <li><strong>email</strong> - Email address</li>
                  <li><strong>phoneNumber</strong> - Contact phone number</li>
                  <li><strong>website</strong> - Company website</li>
                  <li><strong>address</strong> - Physical address</li>
                  <li><strong>additionalRequirements</strong> - Any additional notes</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-outline mr-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={!excelFile || isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Leads'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadForm;