import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead, LeadStatus } from '../types';
import LeadCard from '../components/leads/LeadCard';
import { PlusCircle, Upload, Filter, ArrowUpDown } from 'lucide-react';
import LeadTable from '../components/leads/LeadTable';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

interface DashboardProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  loading: boolean;
  error: string | null;
}

const Dashboard = ({ leads, setLeads, loading, error }: DashboardProps) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get unique categories from leads
  const categories = ['all', ...new Set(leads.map(lead => lead.category))].sort();

  // Filter leads based on selected status and category
  const filteredLeads = leads.filter(lead => {
    const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || lead.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  // Sort leads based on selected field and direction
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const fieldA = a[sortField] || '';
    const fieldB = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
    } else {
      return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
    }
  });

  // Toggle sort direction or change sort field
  const handleSort = (field: keyof Lead) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800">Error Loading Leads</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your leads in one place
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/leads/new')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Lead</span>
          </button>
          
          <button
            onClick={() => navigate('/leads/new?upload=true')}
            className="btn btn-outline flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Leads</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
                className="rounded-md border-gray-300 py-1 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="rejected">Rejected</option>
                <option value="follow-up">Follow Up</option>
                <option value="success">Success</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-md border-gray-300 py-1 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
               {categories
  .filter((cat): cat is string => !!cat && cat !== 'all')
  .map(category => (
    <option key={category} value={category}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </option>
))}

              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-5 w-5 text-gray-400" />
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortField(field as keyof Lead);
                  setSortDirection(direction as 'asc' | 'desc');
                }}
                className="rounded-md border-gray-300 py-1 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="companyName-asc">Company (A-Z)</option>
                <option value="companyName-desc">Company (Z-A)</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                viewMode === 'table'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Grid View
            </button>
          </div>
        </div>

        {sortedLeads.length === 0 ? (
          <EmptyState 
            title="No leads found" 
            description="Get started by adding your first lead or uploading a batch of leads."
            action={() => navigate('/leads/new')}
            actionText="Add Lead"
          />
        ) : viewMode === 'table' ? (
          <LeadTable leads={sortedLeads} onSort={handleSort} sortField={sortField} sortDirection={sortDirection} />
        ) : (
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedLeads.map((lead) => (
              <LeadCard key={lead._id} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;