import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Lead } from '../../types/lead';
import StatusBadge from '../ui/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface LeadCardProps {
  lead: Lead;
}

const LeadCard = ({ lead }: LeadCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="card p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col"
      onClick={() => navigate(`/leads/${lead._id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-500">{lead.companyName}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>
      
      <div className="space-y-2 mt-4 text-sm text-gray-600 flex-grow">
        {lead.email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        
        {lead.phoneNumber && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            <span>{lead.phoneNumber}</span>
          </div>
        )}
        
        {lead.website && (
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{lead.website}</span>
          </div>
        )}
        
        {lead.address && (
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
            <span className="line-clamp-2">{lead.address}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Added: {lead.createdAt ? formatDate(lead.createdAt) : 'N/A'}
        </span>
        <button
          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/leads/${lead._id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default LeadCard;