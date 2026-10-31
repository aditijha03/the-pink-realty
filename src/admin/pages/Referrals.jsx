import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import { 
  Phone, 
  Mail, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  X, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Gift, 
  Users, 
  Building2, 
  FileText
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
  { value: 'contacted', label: 'Contacted', color: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
  { value: 'deal_closed', label: 'Deal Closed', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
  { value: 'payout_pending', label: 'Payout Pending', color: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' },
  { value: 'paid', label: 'Paid', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  { value: 'rejected', label: 'Rejected', color: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400 border-gray-200 dark:border-white/10' }
];

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'referral' | 'partner'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Side Drawer state
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerForm, setDrawerForm] = useState({
    status: '',
    adminNotes: '',
    rewardAmount: '',
    paidAt: ''
  });
  const [savingDrawer, setSavingDrawer] = useState(false);
  const [drawerSuccess, setDrawerSuccess] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('type', activeTab);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('page', page);
      params.set('limit', '20');

      const response = await apiFetch(`/admin/referrals?${params.toString()}`);
      if (response && response.success && response.data) {
        setReferrals(response.data.referrals || []);
        setTotalPages(response.data.pages || 1);
        setTotalCount(response.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, searchQuery, page]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  // Open drawer
  const openDrawer = (referral) => {
    setSelectedReferral(referral);
    setDrawerForm({
      status: referral.status || 'new',
      adminNotes: referral.adminNotes || '',
      rewardAmount: referral.rewardAmount != null ? referral.rewardAmount : '',
      paidAt: referral.paidAt ? referral.paidAt.split('T')[0] : ''
    });
    setDrawerSuccess(false);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedReferral(null);
  };

  // Save drawer updates
  const handleSaveDrawer = async (e) => {
    e.preventDefault();
    if (!selectedReferral) return;
    setSavingDrawer(true);
    try {
      const body = {
        status: drawerForm.status,
        adminNotes: drawerForm.adminNotes,
        rewardAmount: drawerForm.rewardAmount === '' ? null : Number(drawerForm.rewardAmount),
        paidAt: drawerForm.paidAt ? new Date(drawerForm.paidAt).toISOString() : null
      };

      const res = await apiFetch(`/admin/referrals/${selectedReferral._id}`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      });

      if (res && res.success) {
        setSelectedReferral(res.data);
        setReferrals(prev => prev.map(item => item._id === res.data._id ? res.data : item));
        setDrawerSuccess(true);
        setTimeout(() => setDrawerSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update referral:', err);
      alert('Failed to update referral: ' + err.message);
    } finally {
      setSavingDrawer(false);
    }
  };

  // Quick inline status change
  const handleInlineStatusChange = async (id, newStatus) => {
    try {
      const res = await apiFetch(`/admin/referrals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (res && res.success) {
        setReferrals(prev => prev.map(item => item._id === id ? res.data : item));
        if (selectedReferral && selectedReferral._id === id) {
          setSelectedReferral(res.data);
          setDrawerForm(f => ({ ...f, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  // Delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await apiFetch(`/admin/referrals/${itemToDelete._id}`, {
        method: 'DELETE'
      });
      if (res && res.success) {
        setReferrals(prev => prev.filter(r => r._id !== itemToDelete._id));
        if (selectedReferral && selectedReferral._id === itemToDelete._id) {
          closeDrawer();
        }
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete referral:', err);
      alert('Failed to delete referral');
    } finally {
      setDeleting(false);
    }
  };

  // CSV export trigger
  const handleExportCsv = () => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    window.open(`${apiUrl}/admin/referrals/export.csv`, '_blank');
  };

  const cleanPhoneDigits = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-1">
            Referrals & Partners
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Review client referrals, track partner collaborations, and manage reward payouts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReferrals}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:text-[#D6246E] transition-colors shadow-sm"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#D6246E] hover:bg-[#B81D5B] text-white font-medium rounded-xl shadow-sm transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 gap-2">
        {[
          { id: 'all', label: 'All Submissions', icon: Users },
          { id: 'referral', label: 'Client Referrals', icon: Gift },
          { id: 'partner', label: 'Partner Requests', icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors -mb-px ${
                isActive
                  ? 'border-[#D6246E] text-[#D6246E]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-surface p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, email, city, company..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#D6246E] transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#D6246E] transition-colors"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-surface rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#D6246E]" />
            <span>Loading referrals...</span>
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-base font-medium">No referrals found.</p>
            <p className="text-sm mt-1">Try clearing your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Referrer</th>
                  <th className="py-3.5 px-4">Client / Partner</th>
                  <th className="py-3.5 px-4">Requirement</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {referrals.map((item) => {
                  const statusOpt = STATUS_OPTIONS.find(s => s.value === item.status) || STATUS_OPTIONS[0];
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toISOString().split('T')[0]}
                        {item.type === 'partner' ? (
                          <span className="block mt-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                            Partner
                          </span>
                        ) : (
                          <span className="block mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Referral
                          </span>
                        )}
                      </td>

                      {/* Referrer */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.referrerName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${cleanPhoneDigits(item.referrerPhone)}`}
                            className="inline-flex items-center gap-1 text-xs text-[#D6246E] hover:underline font-medium"
                            title="Tap to Call"
                          >
                            <Phone className="w-3 h-3" />
                            {item.referrerPhone}
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[200px]">
                          {item.referrerEmail}
                        </div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                          {item.referrerType} • {item.referrerCity}
                          {item.company ? ` • ${item.company}` : ''}
                        </div>
                      </td>

                      {/* Client or Partner Details */}
                      <td className="py-4 px-4 align-top">
                        {item.type === 'referral' ? (
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              <span>{item.clientName || 'N/A'}</span>
                              {item.isDuplicate && (
                                <span 
                                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-500/30"
                                  title={item.duplicateReason || 'Possible duplicate referral within last 90 days'}
                                >
                                  <AlertTriangle className="w-3 h-3 shrink-0" />
                                  Possible duplicate
                                </span>
                              )}
                            </div>
                            {item.clientPhone && (
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${cleanPhoneDigits(item.clientPhone)}`}
                                  className="inline-flex items-center gap-1 text-xs text-[#D6246E] hover:underline font-medium"
                                  title="Tap to Call Client"
                                >
                                  <Phone className="w-3 h-3" />
                                  {item.clientPhone}
                                </a>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {item.location && <span>Loc: {item.location}</span>}
                              {item.budget && <span className="ml-2">Budget: {item.budget}</span>}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {item.company || item.referrerName}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 italic">
                              "{item.message}"
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Requirement */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {item.type === 'referral' ? (
                          <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200">
                            {item.requirement || 'General'}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300">
                            Partnership
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <select
                          value={item.status}
                          onChange={(e) => handleInlineStatusChange(item._id, e.target.value)}
                          className={`text-xs font-bold py-1 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#D6246E] cursor-pointer transition-colors ${statusOpt.color}`}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#14101C] text-gray-900 dark:text-gray-100">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDrawer(item)}
                            className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-white/10 hover:bg-[#D6246E] hover:text-white rounded-lg transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => { setItemToDelete(item); setDeleteModalOpen(true); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                            aria-label="Delete referral"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              Showing {referrals.length} of {totalCount} submissions
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel Drawer */}
      {drawerOpen && selectedReferral && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeDrawer}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#14101C] h-full shadow-2xl border-l border-gray-200 dark:border-white/10 z-10 flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white dark:bg-[#14101C] z-10">
              <div>
                <span className="text-xs uppercase font-bold text-[#D6246E] tracking-wider">
                  {selectedReferral.type === 'referral' ? 'Client Referral' : 'Partner Request'}
                </span>
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-gray-100">
                  Submission Details
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              {drawerSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Referral details updated successfully!</span>
                </div>
              )}

              {/* Duplicate Warning */}
              {selectedReferral.isDuplicate && (
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                        Possible Duplicate Referral
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                        {selectedReferral.duplicateReason || 'This client phone number matches another referral submitted in the last 90 days. Please review before proceeding with reward payout.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Referrer Info Card */}
              <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-xl border border-gray-100 dark:border-white/5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D6246E]" /> Referrer Information
                </h3>
                <div>
                  <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {selectedReferral.referrerName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {selectedReferral.referrerType} • {selectedReferral.referrerCity}
                    {selectedReferral.company ? ` • ${selectedReferral.company}` : ''}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={`tel:${cleanPhoneDigits(selectedReferral.referrerPhone)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200 hover:text-[#D6246E] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D6246E]" />
                    Call Referrer ({selectedReferral.referrerPhone})
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhoneDigits(selectedReferral.referrerPhone)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Referrer
                  </a>
                  <a
                    href={`mailto:${selectedReferral.referrerEmail}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200 hover:text-[#D6246E] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D6246E]" />
                    {selectedReferral.referrerEmail}
                  </a>
                </div>
              </div>

              {/* Client or Partner Details Card */}
              {selectedReferral.type === 'referral' ? (
                <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-xl border border-gray-100 dark:border-white/5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#D6246E]" /> Referred Client Details
                  </h3>
                  <div>
                    <div className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {selectedReferral.clientName}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Requirement:</span> {selectedReferral.requirement}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Preferred Location:</span> {selectedReferral.location}
                    </div>
                    {selectedReferral.budget && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Budget:</span> {selectedReferral.budget}
                      </div>
                    )}
                    {selectedReferral.note && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 bg-white dark:bg-surface p-2.5 rounded-lg border border-gray-200 dark:border-white/5 italic">
                        "{selectedReferral.note}"
                      </div>
                    )}
                  </div>

                  {selectedReferral.clientPhone && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a
                        href={`tel:${cleanPhoneDigits(selectedReferral.clientPhone)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200 hover:text-[#D6246E] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#D6246E]" />
                        Call Client ({selectedReferral.clientPhone})
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhoneDigits(selectedReferral.clientPhone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp Client
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-xl border border-gray-100 dark:border-white/5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" /> Collaboration Proposal
                  </h3>
                  {selectedReferral.company && (
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Company: {selectedReferral.company}
                    </div>
                  )}
                  <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-surface p-3 rounded-lg border border-gray-200 dark:border-white/5 whitespace-pre-wrap leading-relaxed">
                    {selectedReferral.message}
                  </div>
                </div>
              )}

              {/* Editable Management Form */}
              <form onSubmit={handleSaveDrawer} className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#D6246E]" /> Workflow & Payout Management
                </h3>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Referral Status
                  </label>
                  <select
                    value={drawerForm.status}
                    onChange={(e) => setDrawerForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#D6246E]"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Reward Amount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reward Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 25000"
                      value={drawerForm.rewardAmount}
                      onChange={(e) => setDrawerForm(f => ({ ...f, rewardAmount: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#D6246E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Paid Date
                    </label>
                    <input
                      type="date"
                      value={drawerForm.paidAt}
                      onChange={(e) => setDrawerForm(f => ({ ...f, paidAt: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#D6246E]"
                    />
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add progress notes, verification remarks, or deal closure notes..."
                    value={drawerForm.adminNotes}
                    onChange={(e) => setDrawerForm(f => ({ ...f, adminNotes: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#D6246E]"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={savingDrawer}
                  className="w-full py-2.5 bg-[#D6246E] hover:bg-[#B81D5B] text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {savingDrawer ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#14101C] border border-gray-200 dark:border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl z-10">
            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
              Delete Referral?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this referral from <strong>{itemToDelete.referrerName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
