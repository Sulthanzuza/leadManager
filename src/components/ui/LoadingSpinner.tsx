import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin text-primary-600">
        <Loader2 className="h-8 w-8" />
      </div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;