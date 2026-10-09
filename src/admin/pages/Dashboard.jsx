import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { Home, Heart, FileText, AlertCircle, Plus, Settings } from 'lucide-react';

const formatPrice = (price) => {
  if (!price || isNaN(price)) return '₹0';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function Dashboard() {
  const [data, setData] = useState({
    stats: { totalProperties: 0, featuredProperties: 0, totalEnquiries: 0, newEnquiries: 0 },
    recentProperties: [],
    recentEnquiries: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch('/admin/dashboard');
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-playfair font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome to the control center. Here is the latest performance summary for The Pink Realty.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Total Properties */}
        <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1">Total Properties</p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{data.stats.totalProperties}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">{data.stats.totalProperties} visible on website</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-100 to-transparent"></div>
        </div>

        {/* Featured Listings */}
        <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1">Featured Listings</p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{data.stats.featuredProperties}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">Highlighted on home screen</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-100 to-transparent"></div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1">Total Enquiries</p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{data.stats.totalEnquiries}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">{data.stats.newEnquiries} pending review</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 to-transparent"></div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-1">Pending Tasks</p>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{data.stats.newEnquiries}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">Requires customer contact</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-100 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Enquiries */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
            <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-gray-100">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs font-bold text-[#D6246E] hover:text-pink-700 uppercase tracking-wider">View All</Link>
          </div>
          <div className="flex-1 overflow-auto">
            {data.recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No recent enquiries.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentEnquiries.map((enq) => (
                  <div key={enq._id} className="p-6 hover:bg-gray-50 dark:bg-white/5 dark:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 capitalize">{enq.name}</h4>
                      {enq.status === 'new' && (
                        <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">NEW</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm text-blue-500 font-medium truncate pr-4">
                        {enq.propertyId?.title || 
                         (enq.message?.startsWith('Interested in: ') && !['Buy', 'Rent', 'Sell', 'Invest'].some(g => enq.message.includes(g)) ? enq.message.replace('Interested in: ', '') : 'General Enquiry')}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(enq.createdAt).toISOString().split('T')[0]}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2">"{enq.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Managed Properties */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
            <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-gray-100">Recently Managed Properties</h2>
            <div className="flex items-center gap-4">
              <Link to="/admin/properties/new" className="flex items-center gap-1 text-xs font-bold text-[#D6246E] hover:text-pink-700 uppercase tracking-wider">
                <Plus className="w-3 h-3" /> Add New
              </Link>
              <Link to="/admin/properties" className="text-xs font-bold text-[#D6246E] hover:text-pink-700 uppercase tracking-wider">Manage</Link>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {data.recentProperties.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No recent properties.</div>
            ) : (
              <div className="space-y-1">
                {data.recentProperties.map((prop) => (
                  <div key={prop._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:bg-white/5 dark:bg-white/5 rounded-xl transition-colors group">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-white/10 overflow-hidden shrink-0">
                      {prop.images?.[0] ? (
                        <img src={prop.images[0].url} alt={prop.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Home className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate mb-1">{prop.title}</h4>
                      <p className="text-xs text-blue-500 mb-1 truncate">{prop.location || 'Location missing'}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{formatPrice(prop.price)}</span>
                        <span>•</span>
                        <span className="capitalize">{prop.propertyType}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center pl-4">
                      <Link to={`/admin/properties/edit/${prop._id}`} className="p-1.5 text-gray-400 hover:text-[#D6246E] hover:bg-pink-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Settings className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
