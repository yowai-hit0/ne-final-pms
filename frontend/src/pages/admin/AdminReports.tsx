import React, { useState } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { BarChart3, Calendar, Download } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import { getEntryReport, getExitReport } from '../../services/ticketService';
import { ReportParams, Ticket } from '../../types';

type ReportType = 'entries' | 'exits';

const AdminReports: React.FC = () => {
  const today = new Date();
  const defaultStartDate = format(subDays(today, 7), 'yyyy-MM-dd');
  const defaultEndDate = format(today, 'yyyy-MM-dd');

  const [reportType, setReportType] = useState<ReportType>('entries');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    lastPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const fetchReport = async (params: ReportParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchFunction = reportType === 'entries' ? getEntryReport : getExitReport;
      const response = await fetchFunction(params);
      
      if (response.status === 'success') {
        setTickets(response.data.tickets);
        setMeta(response.data.meta);
        setHasRun(true);
      }
    } catch (err: any) {
      setError(err.message || `Failed to generate ${reportType} report`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchReport({
      startDate,
      endDate,
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (page: number) => {
    fetchReport({
      startDate,
      endDate,
      page,
      limit: meta.limit,
    });
  };

  const handleExportCsv = () => {
    // This would be implemented to export the data as CSV
    alert('Export feature would download a CSV of this report.');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotalRevenue = () => {
    return tickets
      .filter(ticket => ticket.exitTime) // Only completed tickets
      .reduce((total, ticket) => total + ticket.chargedAmount, 0);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Parking Reports</h1>
        <p className="mt-2 text-gray-600">
          Generate and analyze parking data reports
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Report Configuration */}
      <Card className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="flex">
              <button
                type="button"
                className={`
                  flex-1 py-2 px-4 text-sm font-medium rounded-l-md 
                  ${reportType === 'entries' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}
                `}
                onClick={() => setReportType('entries')}
              >
                Entries
              </button>
              <button
                type="button"
                className={`
                  flex-1 py-2 px-4 text-sm font-medium rounded-r-md 
                  ${reportType === 'exits' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}
                `}
                onClick={() => setReportType('exits')}
              >
                Exits
              </button>
            </div>
          </div>
          
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              isLoading={loading}
              fullWidth
              icon={<BarChart3 className="h-4 w-4" />}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Results */}
      {hasRun && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {reportType === 'entries' ? 'Entry' : 'Exit'} Report: {format(parseISO(startDate), 'MMM d, yyyy')} - {format(parseISO(endDate), 'MMM d, yyyy')}
            </h2>
            
            <Button
              variant="outline"
              onClick={handleExportCsv}
              icon={<Download className="h-4 w-4" />}
            >
              Export CSV
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Total Records</div>
              <div className="text-3xl font-bold text-blue-700 mt-1">{meta.total}</div>
            </Card>
            
            {reportType === 'exits' && (
              <Card className="bg-green-50 border border-green-100">
                <div className="text-sm text-green-600 font-medium">Total Revenue</div>
                <div className="text-3xl font-bold text-green-700 mt-1">
                  {formatCurrency(calculateTotalRevenue())}
                </div>
              </Card>
            )}
            
            <Card className="bg-purple-50 border border-purple-100">
              <div className="text-sm text-purple-600 font-medium">Date Range</div>
              <div className="text-xl font-bold text-purple-700 mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(parseISO(startDate), 'MM/dd/yyyy')} - {format(parseISO(endDate), 'MM/dd/yyyy')}
              </div>
            </Card>
          </div>

          {/* Report Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {reportType === 'entries' ? 'Entry Time' : 'Exit Time'}
                    </th>
                    {reportType === 'exits' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={reportType === 'entries' ? 4 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No records found for this period
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.user?.firstName} {ticket.user?.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticket.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.parking?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticket.parking?.code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.user?.vehiclePlateNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reportType === 'entries'
                            ? format(parseISO(ticket.entryTime), 'MMM d, yyyy h:mm a')
                            : ticket.exitTime && format(parseISO(ticket.exitTime), 'MMM d, yyyy h:mm a')}
                        </td>
                        {reportType === 'exits' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(ticket.chargedAmount)}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;