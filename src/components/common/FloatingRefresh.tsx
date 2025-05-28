import { useQueryClient } from 'react-query';
import { RefreshCw } from 'react-feather';

export function FloatingRefresh() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <button
      onClick={handleRefresh}
      className="fixed bottom-6 right-6 bg-blue-300 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50 cursor-pointer"
      aria-label="Refresh all data"
    >
      <RefreshCw size={20} />
    </button>
  );
}
