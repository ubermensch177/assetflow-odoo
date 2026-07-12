export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;

  // Extract headers
  const headers = Object.keys(data[0]).join(',');

  // Extract rows
  const csvRows = data.map(row => {
    return Object.values(row).map(value => {
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      const stringValue = String(value);
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    }).join(',');
  });

  // Combine headers and rows
  const csvString = [headers, ...csvRows].join('\n');

  // Create a blob and trigger download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
