'use client'

import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react'
import { useState } from 'react'

const enquiries = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', carId: 'C1001', status: 'Pending', date: '2023-05-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', carId: 'C1002', status: 'Approved', date: '2023-05-14' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '345-678-9012', carId: 'C1003', status: 'Rejected', date: '2023-05-13' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '456-789-0123', carId: 'C1004', status: 'Pending', date: '2023-05-12' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '567-890-1234', carId: 'C1005', status: 'Pending', date: '2023-05-11' },
]

export default function EnquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(enquiries.length / itemsPerPage)

  const handleApprove = (id) => {
    console.log(`Approved enquiry ${id}`)
    // Add approval logic here
  }

  const handleReject = (id) => {
    console.log(`Rejected enquiry ${id}`)
    // Add rejection logic here
  }

  const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"
    switch (status) {
      case 'Approved':
        return <span className={`${baseClasses} bg-green-50 text-green-700 border border-green-100`}><CheckCircle2 size={14} /> Approved</span>
      case 'Rejected':
        return <span className={`${baseClasses} bg-red-50 text-red-700 border border-red-100`}><XCircle size={14} /> Rejected</span>
      default:
        return <span className={`${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-100`}><Clock size={14} /> Pending</span>
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Enquiry Management</h1>
          <p className="text-gray-500">Review and manage customer enquiries</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
          <Link href="/admin/enquiries/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            <span>Add Enquiry</span>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Contact', 'Car ID', 'Date', 'Status', 'Actions'].map((col) => (
                  <th 
                    key={col} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{enquiry.name}</div>
                    <div className="text-gray-500 text-sm">{enquiry.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {enquiry.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-mono">
                    {enquiry.carId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {enquiry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={enquiry.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      {enquiry.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(enquiry.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle2 size={16} />
                            <span>Approve</span>
                          </button>
                          <button 
                            onClick={() => handleReject(enquiry.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <XCircle size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      <Link 
                        href={`/admin/enquiries/${enquiry.id}`} 
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <span>Details</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">1</span> to <span className="font-medium text-gray-700">{itemsPerPage}</span> of{' '}
            <span className="font-medium text-gray-700">{enquiries.length}</span> results
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md border ${currentPage === page ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700'} hover:bg-gray-50 transition-colors`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}