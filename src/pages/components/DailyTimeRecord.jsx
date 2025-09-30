import React, { useState } from 'react';
import { Download, Printer, Calendar, User, Building2, Clock, Save, Plus, Minus, FileText } from 'lucide-react';

function DailyTimeRecord() {
  const [employeeInfo, setEmployeeInfo] = useState({
    name: '',
    position: '',
    salary: '',
    department: '',
    employeeId: '',
    period: ''
  });

  const [timeRecords, setTimeRecords] = useState([
    { day: 1, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 2, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 3, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 4, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 5, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 6, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 7, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 8, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 9, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 10, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 11, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 12, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 13, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 14, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 15, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 16, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 17, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 18, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 19, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 20, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 21, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 22, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 23, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 24, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 25, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 26, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 27, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 28, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 29, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 30, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' },
    { day: 31, am_arrival: '', am_departure: '', pm_arrival: '', pm_departure: '', overtime_in: '', overtime_out: '', undertime: '' }
  ]);

  const [summary, setSummary] = useState({
    total_undertimes: '',
    total_tardiness: '',
    certifiedBy: '',
    certifiedDate: ''
  });

  const updateEmployeeInfo = (field, value) => {
    setEmployeeInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateTimeRecord = (day, field, value) => {
    setTimeRecords(prev => prev.map(record =>
      record.day === day ? { ...record, [field]: value } : record
    ));
  };

  const updateSummary = (field, value) => {
    setSummary(prev => ({ ...prev, [field]: value }));
  };

  const exportToWord = () => {
    // Split records
    const firstHalf = timeRecords.slice(0, 16);
    const secondHalf = timeRecords.slice(16);

    // Build tables
    const buildTable = (records) => `
          <table>
            <thead>
              <tr>
                <th rowspan="2" class="day-column">Day</th>
                <th colspan="2">A.M.</th>
                <th colspan="2">P.M.</th>
                <th colspan="2">Overtime</th>
                <th rowspan="2" class="time-column">Under-time</th>
              </tr>
              <tr>
                <th class="time-column">Arrival</th>
                <th class="time-column">Departure</th>
                <th class="time-column">Arrival</th>
                <th class="time-column">Departure</th>
                <th class="time-column">In</th>
                <th class="time-column">Out</th>
              </tr>
            </thead>
            <tbody>
              ${records.map(record => `
                <tr>
                  <td class="day-column"><b>${record.day}</b></td>
                  <td class="time-column">${record.am_arrival || ''}</td>
                  <td class="time-column">${record.am_departure || ''}</td>
                  <td class="time-column">${record.pm_arrival || ''}</td>
                  <td class="time-column">${record.pm_departure || ''}</td>
                  <td class="time-column">${record.overtime_in || ''}</td>
                  <td class="time-column">${record.overtime_out || ''}</td>
                  <td class="time-column">${record.undertime || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;

    const table1 = buildTable(firstHalf);
    const table2 = buildTable(secondHalf);

    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>Daily Time Record</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotPromptForConvert/>
              <w:DoNotShowInsertionsAndDeletions/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page { 
              margin: 0.5in; 
              size: 8.5in 11in;
            }
            body { 
              font-family: 'Calibri', sans-serif; 
              font-size: 10pt;
              line-height: 1.1;
              margin: 0;
              padding: 0;
            }
            .header { 
              text-align: center; 
              margin-bottom: 10px; 
            }
            .form-title { 
              font-size: 14pt; 
              font-weight: bold; 
              margin-bottom: 3px; 
            }
            .form-subtitle {
              font-size: 10pt;
              margin-bottom: 10px;
            }
            .employee-info { 
              margin-bottom: 10px;
              font-size: 9pt;
            }
            .info-row { 
              margin-bottom: 4px; 
              display: flex;
            }
            .info-label { 
              font-weight: bold; 
              min-width: 100px;
            }
            .info-value {
              border-bottom: 1px solid black;
              flex: 1;
              min-height: 14px;
              padding-left: 5px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px;
              font-size: 8pt;
            }
            th, td { 
              border: 1px solid black; 
              padding: 2px; 
              text-align: center; 
              vertical-align: middle;
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold; 
            }
            .day-column {
              width: 25px;
            }
            .time-column {
              width: 40px;
            }
            .summary-section { 
              margin-top: 10px;
              font-size: 9pt;
            }
            .summary-item {
              margin-bottom: 6px;
              display: flex;
            }
            .summary-label {
              font-weight: bold;
              min-width: 100px;
            }
            .summary-value {
              border-bottom: 1px solid black;
              flex: 1;
              min-height: 14px;
              padding-left: 5px;
            }
            .certification {
              margin-top: 15px;
              font-size: 9pt;
              line-height: 1.3;
            }
            .signature-section {
              margin-top: 10px;
            }
            .signature-row {
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 48%;
              text-align: center;
            }
            .signature-line { 
              border-bottom: 1px solid black; 
              height: 20px;
              margin-bottom: 5px;
            }
            .signature-label {
              font-size: 8pt;
            }
            .dtr-container {
              display: flex;
              gap: 15px;
            }
            .dtr-column {
              width: 50%;
            }
            .page-break {
              page-break-after: always;
            }
          </style>
        </head>
        <body>
          <div class="dtr-container">
            <!-- Column 1 -->
            <div class="dtr-column">
              <div class="header">
                <div class="form-title">DAILY TIME RECORD</div>
                <div class="form-subtitle">(Civil Service Form No. 48)</div>
              </div>
              
              <div class="employee-info">
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${employeeInfo.name || ''}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Position:</span>
                  <span class="info-value">${employeeInfo.position || ''}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">For the Month of:</span>
                  <span class="info-value">${employeeInfo.period || ''}</span>
                </div>
              </div>

              ${table1}

              <div class="summary-section">
                <div class="summary-item">
                  <span class="summary-label">Total Undertimes:</span>
                  <span class="summary-value">${summary.total_undertimes || ''}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Total Tardiness:</span>
                  <span class="summary-value">${summary.total_tardiness || ''}</span>
                </div>
              </div>

              <div class="certification">
                <p><b>I CERTIFY</b> on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.</p>
                
                <div class="signature-section">
                  <div class="signature-row">
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">Employee Signature</div>
                    </div>
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">Date</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="certification">
                <p><b>VERIFIED</b> as to the prescribed office hours:</p>
                
                <div class="signature-section">
                  <div class="signature-row">
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">${summary.certifiedBy || 'Supervisor/Manager Name'}</div>
                      <div class="signature-label">Signature</div>
                    </div>
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">${summary.certifiedDate || ''}</div>
                      <div class="signature-label">Date</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Column 2 -->
            <div class="dtr-column">
              <div class="header">
                <div class="form-title">DAILY TIME RECORD</div>
                <div class="form-subtitle">(Civil Service Form No. 48)</div>
              </div>
              
              <div class="employee-info">
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${employeeInfo.name || ''}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Position:</span>
                  <span class="info-value">${employeeInfo.position || ''}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">For the Month of:</span>
                  <span class="info-value">${employeeInfo.period || ''}</span>
                </div>
              </div>

              ${table2}

              <div class="summary-section">
                <div class="summary-item">
                  <span class="summary-label">Total Undertimes:</span>
                  <span class="summary-value">${summary.total_undertimes || ''}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Total Tardiness:</span>
                  <span class="summary-value">${summary.total_tardiness || ''}</span>
                </div>
              </div>

              <div class="certification">
                <p><b>I CERTIFY</b> on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office.</p>
                
                <div class="signature-section">
                  <div class="signature-row">
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">Employee Signature</div>
                    </div>
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">Date</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="certification">
                <p><b>VERIFIED</b> as to the prescribed office hours:</p>
                
                <div class="signature-section">
                  <div class="signature-row">
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">${summary.certifiedBy || 'Supervisor/Manager Name'}</div>
                      <div class="signature-label">Signature</div>
                    </div>
                    <div class="signature-box">
                      <div class="signature-line"></div>
                      <div class="signature-label">${summary.certifiedDate || ''}</div>
                      <div class="signature-label">Date</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', wordContent], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DTR_${employeeInfo.name || 'Employee'}_${employeeInfo.period || new Date().toISOString().slice(0, 7)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printRecord = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 print:px-0 print:py-0">
        {/* Header Controls - Hide on Print */}
        <div className="mb-6 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">Daily Time Record</h1>
              <div className="w-12 h-0.5 bg-blue-600"></div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={printRecord}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={exportToWord}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Export to Word
              </button>
            </div>
          </div>
        </div>

        {/* Form Container - Two Columns */}
        <div className="bg-white border border-gray-200 rounded-lg print:border-0 print:shadow-none">
          <style jsx>{`
                        @media print {
                            .dtr-container {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 15px;
                                padding: 0 0.5in;
                            }
                            .dtr-column {
                                break-inside: avoid;
                            }
                            .dtr-header {
                                margin-bottom: 8px;
                            }
                            .dtr-table {
                                font-size: 8pt;
                            }
                            .dtr-summary {
                                margin-top: 10px;
                            }
                            .signature-section {
                                margin-top: 8px;
                            }
                            input {
                                background: transparent !important;
                            }
                        }
                    `}</style>

          <div className="dtr-container">
            {/* Column 1 */}
            <div className="dtr-column">
              {/* Header */}
              <div className="text-center py-3 border-b border-gray-200 print:border-black dtr-header">
                <h2 className="text-xl font-bold text-gray-900 mb-1">DAILY TIME RECORD</h2>
                <p className="text-xs text-gray-600">(Civil Service Form No. 48)</p>
              </div>

              {/* Employee Info */}
              <div className="p-3 print:p-2">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Name:</span>
                    <input
                      type="text"
                      value={employeeInfo.name}
                      onChange={(e) => updateEmployeeInfo('name', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Position:</span>
                    <input
                      type="text"
                      value={employeeInfo.position}
                      onChange={(e) => updateEmployeeInfo('position', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">For the Month of:</span>
                    <input
                      type="month"
                      value={employeeInfo.period}
                      onChange={(e) => updateEmployeeInfo('period', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Time Table - First Half (Days 1-16) */}
              <div className="overflow-x-auto p-2">
                <table className="w-full border border-gray-300 print:border-black dtr-table">
                  <thead>
                    <tr className="bg-gray-50 print:bg-white">
                      <th rowSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">DAY</th>
                      <th colSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">A.M.</th>
                      <th colSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">P.M.</th>
                      <th colSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">OVERTIME</th>
                      <th rowSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">UNDERTIME</th>
                    </tr>
                    <tr className="bg-gray-50 print:bg-white">
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Arrival</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Departure</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Arrival</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Departure</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">In</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeRecords.slice(0, 16).map((record) => (
                      <tr key={record.day}>
                        <td className="border border-gray-300 print:border-black p-1 text-center text-xs font-medium">{record.day}</td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.am_arrival}
                            onChange={(e) => updateTimeRecord(record.day, 'am_arrival', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.am_departure}
                            onChange={(e) => updateTimeRecord(record.day, 'am_departure', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.pm_arrival}
                            onChange={(e) => updateTimeRecord(record.day, 'pm_arrival', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.pm_departure}
                            onChange={(e) => updateTimeRecord(record.day, 'pm_departure', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.overtime_in}
                            onChange={(e) => updateTimeRecord(record.day, 'overtime_in', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.overtime_out}
                            onChange={(e) => updateTimeRecord(record.day, 'overtime_out', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="text"
                            value={record.undertime}
                            onChange={(e) => updateTimeRecord(record.day, 'undertime', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent placeholder:text-xs"
                            placeholder="hrs"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary & Certification */}
              <div className="p-3 print:p-2 dtr-summary">
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Total Undertimes:</span>
                    <input
                      type="text"
                      value={summary.total_undertimes}
                      onChange={(e) => updateSummary('total_undertimes', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Total Tardiness:</span>
                    <input
                      type="text"
                      value={summary.total_tardiness}
                      onChange={(e) => updateSummary('total_tardiness', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 print:border-black pt-2">
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">
                    I CERTIFY on my honor that the above is a true and correct report of the hours of work performed,
                    record of which was made daily at the time of arrival and departure from office.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="text-center">
                      <div className="border-b border-gray-300 print:border-black h-6 mb-1"></div>
                      <p className="text-xs text-gray-600">Employee Signature</p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-gray-300 print:border-black h-6 mb-1"></div>
                      <p className="text-xs text-gray-600">Date</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">VERIFIED as to prescribed office hours:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={summary.certifiedBy}
                          onChange={(e) => updateSummary('certifiedBy', e.target.value)}
                          className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                          placeholder="Supervisor/Manager Name"
                        />
                        <p className="text-xs text-gray-600 text-center">Signature</p>
                      </div>
                      <div>
                        <input
                          type="date"
                          value={summary.certifiedDate}
                          onChange={(e) => updateSummary('certifiedDate', e.target.value)}
                          className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                        />
                        <p className="text-xs text-gray-600 text-center">Date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="dtr-column">
              {/* Header */}
              <div className="text-center py-3 border-b border-gray-200 print:border-black dtr-header">
                <h2 className="text-xl font-bold text-gray-900 mb-1">DAILY TIME RECORD</h2>
                <p className="text-xs text-gray-600">(Civil Service Form No. 48)</p>
              </div>

              {/* Employee Info */}
              <div className="p-3 print:p-2">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Name:</span>
                    <input
                      type="text"
                      value={employeeInfo.name}
                      onChange={(e) => updateEmployeeInfo('name', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Position:</span>
                    <input
                      type="text"
                      value={employeeInfo.position}
                      onChange={(e) => updateEmployeeInfo('position', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">For the Month of:</span>
                    <input
                      type="month"
                      value={employeeInfo.period}
                      onChange={(e) => updateEmployeeInfo('period', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Time Table - Second Half (Days 17-31) */}
              <div className="overflow-x-auto p-2">
                <table className="w-full border border-gray-300 print:border-black dtr-table">
                  <thead>
                    <tr className="bg-gray-50 print:bg-white">
                      <th rowSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">DAY</th>
                      <th colSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">A.M.</th>
                      <th colSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">P.M.</th>
                      <th colSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">OVERTIME</th>
                      <th rowSpan={2} className="border border-gray-300 print:border-black p-1 text-xs font-semibold">UNDERTIME</th>
                    </tr>
                    <tr className="bg-gray-50 print:bg-white">
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Arrival</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Departure</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Arrival</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Departure</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">In</th>
                      <th className="border border-gray-300 print:border-black p-1 text-xs">Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeRecords.slice(16).map((record) => (
                      <tr key={record.day}>
                        <td className="border border-gray-300 print:border-black p-1 text-center text-xs font-medium">{record.day}</td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.am_arrival}
                            onChange={(e) => updateTimeRecord(record.day, 'am_arrival', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.am_departure}
                            onChange={(e) => updateTimeRecord(record.day, 'am_departure', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.pm_arrival}
                            onChange={(e) => updateTimeRecord(record.day, 'pm_arrival', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.pm_departure}
                            onChange={(e) => updateTimeRecord(record.day, 'pm_departure', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.overtime_in}
                            onChange={(e) => updateTimeRecord(record.day, 'overtime_in', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="time"
                            value={record.overtime_out}
                            onChange={(e) => updateTimeRecord(record.day, 'overtime_out', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 print:border-black p-1">
                          <input
                            type="text"
                            value={record.undertime}
                            onChange={(e) => updateTimeRecord(record.day, 'undertime', e.target.value)}
                            className="w-full text-center text-xs border-0 focus:outline-none print:bg-transparent placeholder:text-xs"
                            placeholder="hrs"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary & Certification */}
              <div className="p-3 print:p-2 dtr-summary">
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Total Undertimes:</span>
                    <input
                      type="text"
                      value={summary.total_undertimes}
                      onChange={(e) => updateSummary('total_undertimes', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">Total Tardiness:</span>
                    <input
                      type="text"
                      value={summary.total_tardiness}
                      onChange={(e) => updateSummary('total_tardiness', e.target.value)}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 print:border-black pt-2">
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">
                    I CERTIFY on my honor that the above is a true and correct report of the hours of work performed,
                    record of which was made daily at the time of arrival and departure from office.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="text-center">
                      <div className="border-b border-gray-300 print:border-black h-6 mb-1"></div>
                      <p className="text-xs text-gray-600">Employee Signature</p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-gray-300 print:border-black h-6 mb-1"></div>
                      <p className="text-xs text-gray-600">Date</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">VERIFIED as to prescribed office hours:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={summary.certifiedBy}
                          onChange={(e) => updateSummary('certifiedBy', e.target.value)}
                          className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                          placeholder="Supervisor/Manager Name"
                        />
                        <p className="text-xs text-gray-600 text-center">Signature</p>
                      </div>
                      <div>
                        <input
                          type="date"
                          value={summary.certifiedDate}
                          onChange={(e) => updateSummary('certifiedDate', e.target.value)}
                          className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-xs print:border-black"
                        />
                        <p className="text-xs text-gray-600 text-center">Date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyTimeRecord;