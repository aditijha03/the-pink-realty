import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Phone, Mail, Trash2 } from 'lucide-react';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Enquiries');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await apiFetch('/admin/enquiries');
        if (response.success) {
          setEnquiries(response.data.enquiries);
        }
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const parseMessage = (msg) => {
    if (!msg) return { property: 'General', text: '' };
    
    // Format from Property Detail page
    if (msg.startsWith('Interested in property: ')) {
      return {
        property: msg.replace('Interested in property: ', ''),
        text: 'I am interested in this property. Please contact me with more information.'
      };
    }
    
    // Format from Enquire Modal (Navbar/CTA/FeaturedProject)
    if (msg.startsWith('Interested in: ')) {
      const interest = msg.replace('Interested in: ', '');
      const generalKeywords = ['Buy', 'Rent', 'Sell', 'Invest'];
      
      if (generalKeywords.some(gen => interest.includes(gen))) {
        return { property: 'General', text: msg };
      } else {
        // e.g. "The Palms Residences"
        return {
          property: interest,
          text: 'I am interested in this property. Please contact me with more information.'
        };
      }
    }
    
    return { property: 'General', text: msg };
  };

  const confirmDelete = async () => {
    if (!enquiryToDelete) return;
    try {
      const response = await apiFetch(`/admin/enquiries/${enquiryToDelete}`, { method: 'DELETE' });
      if (response.success) {
        setEnquiries(enquiries.filter(e => e._id !== enquiryToDelete));
      }
    } catch (err) {
      console.error(err);
    }
    setDeleteModalOpen(false);
    setEnquiryToDelete(null);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await apiFetch(`/admin/enquiries/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (response.success) {
        setEnquiries(enquiries.map(e => e._id === id ? { ...e, status: newStatus } : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const msg = e.message || '';
    const generalKeywords = ['Buy', 'Rent', 'Sell', 'Invest'];
    
    const isDetailLead = msg.startsWith('Interested in property: ');
    const isModalLead = msg.startsWith('Interested in: ') && !generalKeywords.some(gen => msg.includes(gen));
    
    const isPropertyLead = isDetailLead || isModalLead;

    if (filter === 'Property Leads') return isPropertyLead;
    if (filter === 'General Contact') return !isPropertyLead;
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-surface rounded-[20px] p-8 shadow-sm border border-gray-100 dark:border-white/10">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-gray-100 mb-2">Customer Enquiries</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Review customer interests, change statuses as you follow up, and manage client communications.</p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-surface rounded-[20px] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
        
        {/* Filters */}
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <div className="inline-flex bg-gray-50 dark:bg-white/5 dark:bg-white/5/80 p-1 rounded-xl">
            {['All Enquiries', 'Property Leads', 'General Contact'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab 
                    ? 'bg-white dark:bg-surface text-gray-900 dark:text-gray-100 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-64">Client Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-64">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-40">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading enquiries...</td></tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No enquiries found in this category.</td></tr>
              ) : (
                filteredEnquiries.map(enq => {
                  const parsed = parseMessage(enq.message);
                  return (
                    <tr key={enq._id} className="hover:bg-gray-50 dark:bg-white/5 dark:bg-white/5/50 transition-colors group">
                      <td className="px-6 py-5 text-sm text-gray-500 dark:text-gray-400 align-top pt-6">
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="px-6 py-5 align-top pt-6">
                        <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">{enq.name}</div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <Phone className="w-3 h-3 mr-1.5" /> {enq.phone || 'N/A'}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Mail className="w-3 h-3 mr-1.5" /> {enq.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top pt-6">
                        <div className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2">{parsed.property}</div>
                      </td>
                      <td className="px-6 py-5 align-top pt-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 pr-8 line-clamp-3">{parsed.text}</p>
                      </td>
                      <td className="px-6 py-5 align-top pt-5">
                        <select
                          value={enq.status || 'new'}
                          onChange={(e) => updateStatus(enq._id, e.target.value)}
                          className={`appearance-none text-sm font-medium px-4 py-2 pr-8 rounded-lg outline-none cursor-pointer border-r-8 border-transparent ${
                            enq.status === 'resolved' ? 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300' :
                            enq.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700' :
                            'bg-[#e8f7ee] dark:bg-green-500/10 text-[#12a150]'
                          }`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.2rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-5 align-top pt-6">
                        <button 
                          onClick={() => { setEnquiryToDelete(enq._id); setDeleteModalOpen(true); }}
                          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface rounded-[20px] p-6 shadow-xl w-full max-w-md border border-gray-100 dark:border-white/10">
            <h3 className="text-xl font-playfair font-bold text-gray-900 dark:text-gray-100 mb-2">Delete Enquiry</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Are you sure you want to delete this enquiry? This action cannot be undone and will permanently remove this lead.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setDeleteModalOpen(false); setEnquiryToDelete(null); }}
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
};

export default Enquiries;
