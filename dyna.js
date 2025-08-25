import { result } from '@dynatrace-sdk/automation-utils';

export default async function () {
  const extractedData = [];

  try {
    const myResult = await result('task-1');// ust task-1 with the 
    console.log('The whole result object:', myResult.records);

    if (myResult && Array.isArray(myResult.records)) {
      myResult.records.forEach(record => {
        if (record.clientVersion && record.hostName && record.requestId) {
          extractedData.push({
            clientVersion: record.clientVersion,
            hostName: record.hostName,
            requestId: record.requestId,
          });
        } else {
          console.warn('Skipping record with missing properties:', record);
        }
      });

      console.log('Extracted Data:', extractedData);

      // Generate CSV content
      let csvContent = 'clientVersion,hostName,requestId\n'; // CSV header
      extractedData.forEach(record => {
        const clientVersion = `"${String(record.clientVersion).replace(/"/g, '""')}"`;
        const hostName = `"${String(record.hostName).replace(/"/g, '""')}"`;
        const requestId = `"${String(record.requestId).replace(/"/g, '""')}"`;
        csvContent += `${clientVersion},${hostName},${requestId}\n`;
      });

      console.log('Generated CSV:', csvContent);

      // Generate HTML table
      let tableContent = `
        <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px;">clientVersion</th>
              <th style="padding: 8px;">hostName</th>
              <th style="padding: 8px;">requestId</th>
            </tr>
          </thead>
          <tbody>
      `;
      extractedData.forEach(record => {
        tableContent += `
          <tr>
            <td style="padding: 8px;">${String(record.clientVersion).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
            <td style="padding: 8px;">${String(record.hostName).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
            <td style="padding: 8px;">${String(record.requestId).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          </tr>
        `;
      });
      tableContent += `
          </tbody>
        </table>
      `;

      console.log('Generated HTML Table:', tableContent);

      // Return data for the workflow
      return {
        status: 'success',
        extractedData,
        csvContent,
        tableContent,
        filename: `export_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`,
      };
    } else {
      console.log('No records found in the result.');
      return {
        status: 'no_records',
        extractedData: [],
        csvContent: '',
        tableContent: '',
        filename: '',
      };
    }
  } catch (error) {
    console.error('Error fetching task result:', error);
    return {
      status: 'error',
      extractedData: [],
      csvContent: '',
      tableContent: '',
      filename: '',
      error: error.message,
    };
  }
}
