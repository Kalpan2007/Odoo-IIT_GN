import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiFolder, 
  FiCheckSquare, 
  FiShoppingCart, 
  FiTruck,
  FiCreditCard,
  FiFileText,
  FiBarChart,
  FiDollarSign
} from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: FiHome },
  { name: 'Projects', to: '/projects', icon: FiFolder },
  { name: 'Tasks', to: '/tasks', icon: FiCheckSquare },
  { name: 'Sales Orders', to: '/sales-orders', icon: FiShoppingCart },
  { name: 'Purchases', to: '/purchases', icon: FiTruck },
  { name: 'Expenses', to: '/expenses', icon: FiCreditCard },
  { name: 'Invoices', to: '/invoices', icon: FiFileText },
  { name: 'Vendor Bills', to: '/vendor-bills', icon: FiDollarSign },
  { name: 'Reports', to: '/reports', icon: FiBarChart },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="bg-white w-64 min-h-screen border-r border-gray-200">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 w-5 h-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};