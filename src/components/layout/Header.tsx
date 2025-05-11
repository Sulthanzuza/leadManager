import { MenuIcon, Search, Bell } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary-600">LeadVault</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            
            <button
              type="button"
              className="ml-4 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex-shrink-0">
                <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden h-8 w-8 rounded-full bg-primary-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span className="font-medium">JD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;