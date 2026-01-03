import { 
  Users,  
  Database,
} from 'lucide-react';
import {useSelector} from 'react-redux';

export const Header = () => {

    const contacts = useSelector((state) => state.contact.contacts);
    
    return (
        <header className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ContactHub
                </h1>
                <p className="text-xs text-gray-500">Professional Contact Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
}
