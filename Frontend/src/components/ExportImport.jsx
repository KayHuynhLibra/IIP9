import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';

function ExportImport() {
  const { refreshTransactions } = useTransactions();
  const { refreshBudgets } = useBudgets();

  const handleExport = async () => {
    try {
      const response = await fetch('/api/transactions/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('/api/transactions/import', {
        method: 'POST',
        body: formData
      });
      refreshTransactions();
      refreshBudgets();
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleExport}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Export Data
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Import Data
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );
}

export default ExportImport;
