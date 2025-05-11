import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut,X } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 ease-out' : 'opacity-0 ease-in pointer-events-none'
        }`}
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 md:hidden transition transform ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        } duration-300 w-64 bg-white overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">LeadVault</h1>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <nav className="px-2 py-2 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setSidebarOpen(false);
                navigate(item.href);
              }}
              className={`${
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              } group flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-150`}
            >
              <item.icon 
                className={`${
                  isActive(item.href) ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-6 w-6 transition-colors duration-150`} 
                aria-hidden="true" 
              />
              {item.name}
            </a>
          ))}
        </nav>
        
        <div className="border-t border-gray-200 pt-4 mt-auto">
          <div className="px-2 space-y-1">
            <button
              className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-base font-medium rounded-md w-full"
            >
              <LogOut className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">LeadVault</h1>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
                >
                  <item.icon 
                    className={`${
                      isActive(item.href) ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5 transition-colors duration-150`} 
                    aria-hidden="true" 
                  />
                  {item.name}
                </a>
              ))}
            </nav>
            
            <div className="border-t border-gray-200 pt-4 mt-auto mx-3 mb-4">
              <div className="space-y-1">
                <button
                  className="text-gray-600 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full"
                >
                  <LogOut className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;