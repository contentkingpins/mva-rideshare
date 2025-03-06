'use client';

import { useState, useEffect } from 'react';
import { Lead } from '@/lib/aws-config';

export default function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.leads);
      } else {
        setError('Failed to fetch leads');
      }
    } catch (err) {
      setError('Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lead Tracking Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">New Leads</h2>
          <p className="text-3xl font-bold text-primary-600">
            {leads.filter(lead => lead.status === 'new').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Qualified Leads</h2>
          <p className="text-3xl font-bold text-green-600">
            {leads.filter(lead => lead.status === 'qualified').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Denied Leads</h2>
          <p className="text-3xl font-bold text-red-600">
            {leads.filter(lead => lead.status === 'denied').length}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.phone}</div>
                  <div className="text-sm text-gray-500">{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">{lead.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lead.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                    lead.status === 'denied' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    View Details
                  </button>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    className="text-sm border-gray-300 rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="denied">Denied</option>
                    <option value="contacted">Contacted</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Contact Information</h3>
                <p>Name: {selectedLead.firstName} {selectedLead.lastName}</p>
                <p>Phone: {selectedLead.phone}</p>
                <p>Email: {selectedLead.email}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Accident Details</h3>
                <p>Role: {selectedLead.role}</p>
                {selectedLead.atFault && (
                  <p>At Fault: {selectedLead.atFault}</p>
                )}
                {selectedLead.guestInfo && (
                  <p>Guest Info: {selectedLead.guestInfo}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold">Legal Information</h3>
                <p>Rideshare Complaint: {selectedLead.rideshareComplaint}</p>
                <p>Police Report: {selectedLead.policeReport}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Additional Information</h3>
                <p>Source: {selectedLead.source}</p>
                <p>Created: {new Date(selectedLead.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(selectedLead.updatedAt).toLocaleString()}</p>
                {selectedLead.notes && (
                  <p>Notes: {selectedLead.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 