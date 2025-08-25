import { result } from '@dynatrace-sdk/automation-utils';

export default async function () {
    const dqlResult = await result('dql_query');
    const records = dqlResult.records || [];

    if (records.length === 0) {
        return 'No data found for the specified time range.';
    }

    let table = '| Client Version|       Host Name           | Request ID |\n';
    table += '| --- -------------|-------------------- | --- |\n';

    records.forEach(row => {
        table += `| ${row.clientVersion || ''} | ${row.hostName || ''} | ${row.requestId || ''} |\n`;
    });

    return table;
}
