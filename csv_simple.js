import { result } from '@dynatrace-sdk/automation-utils';

export default async function () {
  const extractedData = [];

  try {
    const myResult = await result('task-1');
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

      // Return data for the workflow
      return {
        status: 'success',
        extractedData,
        csvContent,
        filename: `export_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`,
      };
    } else {
      console.log('No records found in the result.');
      return {
        status: 'no_records',
        extractedData: [],
        csvContent: '',
        filename: '',
      };
    }
  } catch (error) {
    console.error('Error fetching task result:', error);
    return {
      status: 'error',
      extractedData: [],
      csvContent: '',
      filename: '',
      error: error.message,
    };
  }
}
