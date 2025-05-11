import { FolderPlus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: () => void;
  actionText?: string;
}

const EmptyState = ({ title, description, action, actionText }: EmptyStateProps) => {
  return (
    <div className="py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex justify-center">
            <div className="bg-primary-100 rounded-full p-4">
              <FolderPlus className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
          {action && actionText && (
            <div className="mt-6">
              <button
                type="button"
                onClick={action}
                className="btn btn-primary"
              >
                {actionText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;