import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PlusCircle, 
  RefreshCw, 
  Database,
  Shield,
  Activity,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import ContactForm from './ContactForm';
import ContactTable from './ContactTable';
import { useSelector } from 'react-redux';

export const Home = () => {
    const [stats, setStats] = useState({
    total: 0,
    withMessages: 0,
    todayAdded: 0
    });

    const contacts = useSelector((state) => state.contact.contacts);
    const loading = useSelector((state) => state.contact.loading);


    useEffect(() => {
        calculateStats();
    }, [contacts]);

    const calculateStats = () => {
    const withMessages = contacts.filter(contact => contact.message && contact.message.trim() !== '').length;
    const today = new Date();
    const todayAdded = contacts.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        return contactDate.toDateString() === today.toDateString();
    }).length;
    
    setStats({
        total: contacts.length,
        withMessages,
        todayAdded
    });
    };
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {getGreeting()}!
                <Sparkles className="inline-block w-6 h-6 text-yellow-500 ml-2" />
              </h2>
              <p className="text-gray-600 mt-2">
                Manage your contacts efficiently with our dashboard
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Total Contacts</h3>
              <p className="text-sm text-gray-500">All contacts in your database</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900">{stats.todayAdded}</span>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">New Today</h3>
              <p className="text-sm text-gray-500">Contacts added today</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <PlusCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900">{stats.withMessages}</span>
                  <div className="text-xs text-gray-500">With notes</div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">With Notes</h3>
              <p className="text-sm text-gray-500">Contacts with additional messages</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 w-full">
              <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <PlusCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Add New Contact</h3>
                    <p className="text-sm text-gray-600">Fill in the details below</p>
                  </div>
                </div>
                <ContactForm />
              </div>
              
              {/* Quick Tips */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3">💡 Quick Tips</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>All fields marked with * are required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Phone must be exactly 10 digits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    <span>Use message field for additional notes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Table */}
          <div className="lg:col-span-2">
            <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-r from-gray-800 to-gray-900 rounded-lg">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Contact Database</h3>
                      <p className="text-sm text-gray-600">Manage all your contacts in one place</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sorted by: </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      Newest First
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-1">
                {loading ? (
                  <div className="py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading contacts...</p>
                    <p className="text-sm text-gray-500 mt-1">Fetching your data from the server</p>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-20 h-20 bg-linear-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No contacts yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start by adding your first contact using the form on the left.
                      Your contact list will appear here once you add some.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <ChevronRight className="w-4 h-4" />
                      <span>Use the form to add contacts</span>
                    </div>
                  </div>
                ) : (
                  <ContactTable />
                )}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Storage</span>
                  <span className="text-gray-900 font-medium">
                    {Math.round((contacts.length * 0.5) * 10) / 10} KB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
}