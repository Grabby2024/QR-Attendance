import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, Clock, User, Building2, ChevronDown, Eye, MoreHorizontal } from 'lucide-react';

function ListofAttendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample attendance data
  const attendanceData = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Juan Dela Cruz',
      department: 'Engineering',
      position: 'Senior Developer',
      date: '2024-09-24',
      checkIn: '08:45',
      checkOut: '17:30',
      status: 'Present',
      workHours: '8h 45m',
      overtime: '0h 30m',
      notes: 'Regular attendance'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Maria Santos',
      department: 'Marketing',
      position: 'Marketing Manager',
      date: '2024-09-24',
      checkIn: '09:15',
      checkOut: '18:00',
      status: 'Late',
      workHours: '8h 45m',
      overtime: '1h 0m',
      notes: 'Traffic delay - excused'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Carlos Rodriguez',
      department: 'Sales',
      position: 'Sales Representative',
      date: '2024-09-24',
      checkIn: '--',
      checkOut: '--',
      status: 'Absent',
      workHours: '--',
      overtime: '--',
      notes: 'Sick leave - medical certificate provided'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Ana Reyes',
      department: 'HR',
      position: 'HR Specialist',
      date: '2024-09-24',
      checkIn: '08:30',
      checkOut: '17:00',
      status: 'Present',
      workHours: '8h 30m',
      overtime: '0h 0m',
      notes: 'Early arrival'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Roberto Garcia',
      department: 'Engineering',
      position: 'Frontend Developer',
      date: '2024-09-24',
      checkIn: '09:30',
      checkOut: '18:30',
      status: 'Late',
      workHours: '9h 0m',
      overtime: '1h 0m',
      notes: 'Client meeting - approved'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      name: 'Lisa Chen',
      department: 'Marketing',
      position: 'Content Creator',
      date: '2024-09-24',
      checkIn: '08:00',
      checkOut: '17:15',
      status: 'Present',
      workHours: '9h 15m',
      overtime: '1h 15m',
      notes: 'Project deadline'
    },
    {
      id: 7,
      employeeId: 'EMP007',
      name: 'Michael Torres',
      department: 'Sales',
      position: 'Account Manager',
      date: '2024-09-24',
      checkIn: '08:45',
      checkOut: '19:00',
      status: 'Present',
      workHours: '10h 15m',
      overtime: '2h 15m',
      notes: 'Client presentation'
    },
    {
      id: 8,
      employeeId: 'EMP008',
      name: 'Sarah Johnson',
      department: 'HR',
      position: 'Recruiter',
      date: '2024-09-24',
      checkIn: '--',
      checkOut: '--',
      status: 'Absent',
      workHours: '--',
      overtime: '--',
      notes: 'Personal emergency - approved'
    },
    {
      id: 9,
      employeeId: 'EMP009',
      name: 'David Kim',
      department: 'Engineering',
      position: 'Backend Developer',
      date: '2024-09-24',
      checkIn: '08:15',
      checkOut: '17:45',
      status: 'Present',
      workHours: '9h 30m',
      overtime: '1h 30m',
      notes: 'System maintenance'
    },
    {
      id: 10,
      employeeId: 'EMP010',
      name: 'Emma Wilson',
      department: 'Marketing',
      position: 'Digital Marketer',
      date: '2024-09-24',
      checkIn: '10:00',
      checkOut: '18:00',
      status: 'Late',
      workHours: '8h 0m',
      overtime: '0h 0m',
      notes: 'Doctor appointment - pre-approved'
    },
    {
      id: 11,
      employeeId: 'EMP011',
      name: 'James Brown',
      department: 'Sales',
      position: 'Sales Director',
      date: '2024-09-24',
      checkIn: '07:30',
      checkOut: '18:30',
      status: 'Present',
      workHours: '11h 0m',
      overtime: '3h 0m',
      notes: 'Board meeting preparation'
    },
    {
      id: 12,
      employeeId: 'EMP012',
      name: 'Sofia Martinez',
      department: 'HR',
      position: 'HR Manager',
      date: '2024-09-24',
      checkIn: '08:30',
      checkOut: '17:30',
      status: 'Present',
      workHours: '9h 0m',
      overtime: '1h 0m',
      notes: 'Policy review meeting'
    }
  ];

  const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR'];
  const statusOptions = ['All Status', 'Present', 'Late', 'Absent'];

  // Filter and search functionality
  const filteredData = useMemo(() => {
    return attendanceData.filter(record => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === 'All Departments' ||
        record.department === selectedDepartment;

      const matchesStatus = selectedStatus === 'All Status' ||
        record.status === selectedStatus;

      const matchesDate = !selectedDate || record.date === selectedDate;

      return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
    });
  }, [searchTerm, selectedDepartment, selectedStatus, selectedDate]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Late':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Attendance Records</h1>
              <div className="w-16 h-0.5 bg-blue-600"></div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, ID, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Date Filter */}
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} records
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('All Departments');
                setSelectedStatus('All Status');
                setSelectedDate('');
                setCurrentPage(1);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Employee</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Department</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Check In</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Check Out</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Work Hours</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Notes</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{record.name}</p>
                          <p className="text-xs text-gray-500">{record.employeeId}</p>
                          <p className="text-xs text-gray-500">{record.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{record.department}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{record.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{record.checkIn}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{record.checkOut}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-gray-900">{record.workHours}</p>
                        {record.overtime !== '--' && record.overtime !== '0h 0m' && (
                          <p className="text-xs text-amber-600">+{record.overtime} OT</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600 max-w-xs truncate" title={record.notes}>
                        {record.notes}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="More Options">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (page === currentPage || page === 1 || page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm border rounded ${page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListofAttendance;