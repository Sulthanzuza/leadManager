import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lead, LeadStatus, ContactedBy } from '../types/lead';
import { fetchLeadById, updateLead, deleteLead } from '../services/api';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface LeadDetailProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const LeadDetail = ({ leads, setLeads }: LeadDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    const getLead = async () => {
      try {
        setLoading(true);
        
        // Try to find the lead in the existing leads array first
        const existingLead = leads.find(lead => lead._id === id);
        
        if (existingLead) {
          setLead(existingLead);
          setFormData(existingLead);
        } else if (id) {
          // If not found in the array, fetch it from the API
          const fetchedLead = await fetchLeadById(id);
          setLead(fetchedLead);
          setFormData(fetchedLead);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError('Failed to load lead details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getLead();
  }, [id, leads]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    
    try {
      const updatedLead = await updateLead(id, formData);
      
      // Update the local state
      setLead(updatedLead);
      
      // Update the lead in the leads array
      setLeads(prev => 
        prev.map(lead => (lead._id === id ? updatedLead : lead))
      );
      
      setIsEditing(false);
      toast.success('Lead updated successfully!');
    } catch (err) {
      console.error('Error updating lead:', err);
      toast.error('Failed to update lead. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteLead(id);
      
      if (success) {
        // Remove the lead from the leads array
        setLeads(prev => prev.filter(lead => lead._id !== id));
        
        toast.success('Lead deleted successfully!');
        navigate('/');
      } else {
        throw new Error('Failed to delete lead');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast.error('Failed to delete lead. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !lead) {
    return (
      <div className="py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800">Error Loading Lead</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || 'Lead not found'}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => navigate('/')}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-sm text-gray-500">
              {lead.companyName}
            </p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(lead);
                }}
                className="btn btn-outline flex items-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Edit className="h-5 w-5" />
                <span>Edit Lead</span>
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-danger flex items-center space-x-2"
              >
                <Trash2 className="h-5 w-5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {isEditing ? (
            <div className="space-y-6">
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
                    value={formData.name || ''}
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
                    value={formData.companyName || ''}
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
                    value={formData.status || 'pending'}
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
                  <label htmlFor="contactedBy" className="label">
                    Contacted By
                  </label>
                  <select
                    name="contactedBy"
                    id="contactedBy"
                    value={formData.contactedBy || ''}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Not Contacted</option>
                    <option value="NAZEEB">Nazeeb</option>
                    <option value="MARIYAM">Mariyam</option>
                    <option value="SULTHAN">Sulthan</option>
                    <option value="YADHU">Yadhu</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="additionalRequirements" className="label">
                  Additional Requirements
                </label>
                <textarea
                  name="additionalRequirements"
                  id="additionalRequirements"
                  rows={4}
                  value={formData.additionalRequirements || ''}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Details and contact information.
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <StatusBadge status={lead.status} />
                </div>
              </div>
              
              <div className="border-t border-gray-200 py-5">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.name}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.companyName}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="text-primary-600 hover:text-primary-700">
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.phoneNumber ? (
                        <a href={`tel:${lead.phoneNumber}`} className="text-primary-600 hover:text-primary-700">
                          {lead.phoneNumber}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.website ? (
                        <a 
                          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {lead.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.address || <span className="text-gray-400">Not provided</span>}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Additional Requirements</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.additionalRequirements ? (
                        <p className="whitespace-pre-line">{lead.additionalRequirements}</p>
                      ) : (
                        <span className="text-gray-400">None provided</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="border-t border-gray-200 py-5">
                <h3 className="text-lg font-medium text-gray-900">Lead Status</h3>
                
                <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <StatusBadge status={lead.status} />
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contacted By</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.contactedBy ? (
                        <span className="capitalize">{lead.contactedBy}</span>
                      ) : (
                        <span className="text-gray-400">Not contacted yet</span>
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date Added</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.createdAt ? formatDate(lead.createdAt) : 'Unknown'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {lead.updatedAt ? formatDate(lead.updatedAt) : 'Unknown'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;