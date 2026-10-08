import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { Plus, Search, SlidersHorizontal, MapPin, Eye, Pencil, Trash2 } from 'lucide-react';

const formatPrice = (price) => {
  if (!price || isNaN(price)) return '₹0';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await apiFetch('/admin/properties');
      if (response.success) {
        setProperties(response.data.properties);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePremium = async (id, currentStatus) => {
    // Optimistic update: if turning on, turn off all others
    setProperties(prev => prev.map(p => {
      if (p._id === id) return { ...p, isPremium: !currentStatus };
      if (!currentStatus) return { ...p, isPremium: false }; // turning this one on means others go off
      return p;
    }));
    try {
      await apiFetch(`/admin/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isPremium: !currentStatus })
      });
    } catch (error) {
      // Fetch again to revert to actual state on error
      fetchProperties();
      alert('Failed to update premium status');
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await apiFetch(`/admin/properties/${propertyToDelete}`, { method: 'DELETE' });
      setProperties(prev => prev.filter(p => p._id !== propertyToDelete));
    } catch (error) {
      alert('Failed to delete property.');
    }
    setDeleteModalOpen(false);
    setPropertyToDelete(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-[3.5rem] leading-none font-playfair font-bold text-[#0B132B] dark:text-white mb-6">Properties</h1>
          <Link 
            to="/admin/properties/new" 
            className="inline-flex items-center gap-2 bg-[#0B132B] hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-[#0B132B] px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Property
          </Link>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="w-full pl-4 pr-10 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-[#D6246E] text-sm bg-white dark:bg-white/5 dark:text-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 dark:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Showing all {properties.length} properties</p>

      <div className="bg-white dark:bg-surface rounded-[1.25rem] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Property Title</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Premium Project</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500 dark:text-gray-400">Loading properties...</td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500 dark:text-gray-400">No properties found.</td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="w-[84px] h-[56px] rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 shrink-0">
                        {property.images?.[0]?.url ? (
                          <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="text-xs font-bold text-[#c99a3c] mb-1 tracking-wider uppercase">{property.reference || 'TPR-000'}</div>
                      <div className="font-bold text-[#0B132B] dark:text-white truncate mb-1">{property.title}</div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        {property.bedrooms || 0} Beds • {property.bathrooms || 0} Baths • {property.areaSqft || 0} sq.ft
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#d6b4c1]" />
                        <span className="truncate max-w-[150px]">{property.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium capitalize">{property.propertyType}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-[#0B132B] dark:text-white">{formatPrice(property.price)}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#ecfdf3] dark:bg-[#027a48]/20 text-[#027a48] dark:text-[#6ce9a6]">
                        Published
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => handleTogglePremium(property._id, property.isPremium)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${property.isPremium ? 'bg-[#0B132B] dark:bg-[#D6246E]' : 'bg-gray-200 dark:bg-white/20'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${property.isPremium ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/property/${property.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-blue-600 border border-transparent hover:border-blue-100 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/properties/edit/${property._id}`} className="p-1.5 text-gray-400 hover:text-gray-900 dark:text-gray-100 border border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/10 rounded transition-all">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { setPropertyToDelete(property._id); setDeleteModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface rounded-[20px] p-6 shadow-xl w-full max-w-md border border-gray-100 dark:border-white/10">
            <h3 className="text-xl font-playfair font-bold text-gray-900 dark:text-gray-100 mb-2">Delete Property</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Are you sure you want to delete this property? This action cannot be undone and will permanently remove this listing from your website.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setDeleteModalOpen(false); setPropertyToDelete(null); }}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
