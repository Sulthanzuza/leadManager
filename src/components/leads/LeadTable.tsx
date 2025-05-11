import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';
import { Lead } from '../../types/lead';
import StatusBadge from '../ui/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface LeadTableProps {
  leads: Lead[];
  onSort: (field: keyof Lead) => void;
  sortField: keyof Lead;
  sortDirection: 'asc' | 'desc';
}

const LeadTable = ({ leads, onSort, sortField, sortDirection }: LeadTableProps) => {
  const navigate = useNavigate();

  const SortIcon = ({ field }: { field: keyof Lead }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            
            <th 
              scope="col"
              className="table-header cursor-pointer"
              onClick={() => onSort('companyName')}
            >
              <div className="flex items-center">
                Company
                <SortIcon field="companyName" />
              </div>
            </th>
            <th 
              scope="col" 
              className="table-header"
            >
              Contact
            </th>
            <th 
  scope="col" 
  className="table-header cursor-pointer"
  onClick={() => onSort('contactedBy')}
>
  <div className="flex items-center">
    Contacted By
    <SortIcon field="contactedBy" />
  </div>
</th>

            <th 
              scope="col" 
              className="table-header cursor-pointer"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status
                <SortIcon field="status" />
              </div>
            </th>
            <th 
              scope="col" 
              className="table-header cursor-pointer"
              onClick={() => onSort('createdAt')}
            >
              <div className="flex items-center">
                Date Added
                <SortIcon field="createdAt" />
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr 
              key={lead._id} 
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => navigate(`/leads/${lead._id}`)}
            >
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{lead.companyName}</div>
                {lead.website && (
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {lead.website}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {lead.email && (
                  <div className="text-sm text-gray-500">{lead.email}</div>
                )}
                {lead.phoneNumber && (
                  <div className="text-sm text-gray-500">{lead.phoneNumber}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {lead.contactedBy || 'N/A'}
</td>

              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.createdAt ? formatDate(lead.createdAt) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open menu or actions
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;