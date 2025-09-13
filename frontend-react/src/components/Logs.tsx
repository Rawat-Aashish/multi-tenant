import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Log {
  id: number;
  message: string;
  status: 'ORDER PLACED' | 'ORDER SKIPPED' | 'NEW ORDER' | null;
  created_at: string;
}

interface LogsProps {
  isLogsOpen: boolean;
  setIsLogsOpen: (isOpen: boolean) => void;
  API_BASE_URL: string;
}

const Logs: React.FC<LogsProps> = ({ isLogsOpen, setIsLogsOpen, API_BASE_URL }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const statusColors: { [key: string]: string } = {
    'ORDER PLACED': 'bg-green-100 text-green-700',
    'ORDER SKIPPED': 'bg-red-100 text-red-700',
    'NEW ORDER': 'bg-blue-100 text-blue-700',
  };

  const fetchLogs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.dismiss();
      toast.error('Authentication failed. Please log in again.', { position: 'top-center' });
      setIsLogsOpen(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          per_page: 10,
        },
      });

      const newLogs = response.data.data;
      setLogs((prevLogs) => {
        const existingIds = new Set(prevLogs.map(log => log.id));
        const uniqueNewLogs = newLogs.filter(log => !existingIds.has(log.id));
        return [...prevLogs, ...uniqueNewLogs];
      });
      setPage((prevPage) => prevPage + 1);
      setHasMore(newLogs.length > 0);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to fetch logs.', { position: 'top-center' });
      } else {
        toast.error('An unexpected error occurred.', { position: 'top-center' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogsOpen) {
      setLogs([]);
      setPage(1);
      setHasMore(true);
      fetchLogs();
    }
  }, [isLogsOpen]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchLogs();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, isLogsOpen]);

  // Prevent scrolling of the main page when the logs panel is open
  useEffect(() => {
    if (isLogsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLogsOpen]);

  return (
    <>
      {isLogsOpen && (
        <div className={`fixed inset-y-0 left-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isLogsOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">User Logs</h2>
            <button
              onClick={() => {
                toast.dismiss();
                setIsLogsOpen(false);
              }}
              className="text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 flex-grow overflow-y-auto h-[calc(100vh-65px)]">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className={`p-4 mb-4 rounded-lg shadow-sm ${statusColors[log.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                  <p className="font-semibold">{log.message}</p>
                  <p className="text-sm font-medium mt-1">{log.status}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              !loading && <p className="text-center text-gray-500 mt-4">No logs found.</p>
            )}
            <div ref={loaderRef} className="flex justify-center p-4">
              {loading && <div className="text-gray-500">Loading more logs...</div>}
              {!hasMore && logs.length > 0 && <div className="text-gray-500">End of logs.</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logs;
