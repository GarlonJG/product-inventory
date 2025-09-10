// utils/exportCsv.js
export const exportCsvFromItems = (items) => {
    if (!items.length) return;
  
    const header = ['name', 'stock', 'sku', 'price', 'description'];
    const csvRows = [
      header.join(','), // header row
      ...items.map(item =>
        header.map(field => `"${(item[field] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      ),
    ];
  
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  