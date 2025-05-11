import { LeadStatus } from '../../types/lead';

interface StatusBadgeProps {
  status: LeadStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-green-100 text-red-800';
      case 'follow-up':
        return 'bg-red-100 text-yellow-800';
      case 'success':
        return 'bg-purple-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'contacted':
        return 'Contacted';
      case 'rejected':
        return 'Rejected';
      case 'follow-up':
        return 'Follow Up';
      case 'success':
        return 'Success';
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={`badge ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;