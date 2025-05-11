import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FilePlus, UserPlus } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/', icon: Users },
    { name: 'Add Lead', href: '/leads/new', icon: UserPlus },
    { name: 'Upload', href: '/leads/new?upload=true', icon: FilePlus },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              isActive(item.href) ? 'text-primary-600' : 'text-gray-500'
            } flex flex-col items-center py-2 px-3`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;