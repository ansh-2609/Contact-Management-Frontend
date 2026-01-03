import { useEffect, useState } from 'react';
import { 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Mail, 
  Phone, 
  User, 
  MessageSquare,
  Calendar,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { deleteContact } from '../services/appServices';
import { useDispatch, useSelector } from 'react-redux';
import { removeContact } from '../store/contactList';

export default function ContactTable() {
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  

  const contacts = useSelector((state) => state.contact.contacts);
  const dispatch = useDispatch();

  // Filter and search contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    
    if (selectedFilter === 'withMessage') {
      return matchesSearch && contact.message && contact.message.trim() !== '';
    }
    if (selectedFilter === 'withoutMessage') {
      return matchesSearch && (!contact.message || contact.message.trim() === '');
    }
    return matchesSearch;
  });

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (sortKey === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const response = await deleteContact(id);

      if (response.ok) {
        dispatch(removeContact(id));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-8 py-6 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
            <p className="text-gray-600 mt-1">
              {contacts.length} total contact{contacts.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Contacts</option>
                <option value="withMessage">With Message</option>
                <option value="withoutMessage">Without Message</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {sortedContacts.length === 0 ? (
        <div className="py-16 px-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No matching contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search or filter'
                : 'Add your first contact using the form above'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </span>
                      {sortKey === 'name' && (
                        sortOrder === 'asc' 
                          ? <ChevronUp className="w-4 h-4 text-blue-500" />
                          : <ChevronDown className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('email')}
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </span>
                      {sortKey === 'email' && (
                        sortOrder === 'asc' 
                          ? <ChevronUp className="w-4 h-4 text-blue-500" />
                          : <ChevronDown className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Phone
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Message
                      </span>
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('createdAt')}
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Added
                      </span>
                      {sortKey === 'createdAt' && (
                        sortOrder === 'asc' 
                          ? <ChevronUp className="w-4 h-4 text-blue-500" />
                          : <ChevronDown className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedContacts.map((contact) => (
                  <tr 
                    key={contact._id} 
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(contact.name)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {contact.message ? (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{contact.message}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No message</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        {formatDate(contact.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {showDeleteConfirm === contact._id ? (
                          <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600 font-medium">Confirm?</span>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              disabled={deletingId === contact._id}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(contact._id)}
                            disabled={deletingId === contact._id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group/delete"
                          >
                            {deletingId === contact._id ? (
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {sortedContacts.map((contact) => (
              <div key={contact._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(contact.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                  </div>
                  
                  {showDeleteConfirm === contact._id ? (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">Confirm?</span>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        disabled={deletingId === contact._id}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(contact._id)}
                      disabled={deletingId === contact._id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      {deletingId === contact._id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{formatDate(contact.createdAt)}</span>
                  </div>
                </div>
                
                {contact.message && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">{contact.message}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      {sortedContacts.length > 0 && (
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>{sortedContacts.length} displayed</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Sorted by {sortKey} ({sortOrder})</span>
              </div>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}