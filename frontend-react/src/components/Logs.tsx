import React, { FC, useCallback, useEffect, useRef } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LogEntry {
  id: number;
  shop_id: number;
  order_id: string;
  status: string;
  created_at: string;
}

interface LogsProps {
  isLogsOpen: boolean;
  setIsLogsOpen: (isOpen: boolean) => void;
  onNewLogs: () => void;
}

// Fetcher for logs, always requests the first page
const logFetcher = async ([url, token]: [string, string]) => {
  const res = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    // Explicitly request the first page and a fixed number of items
    params: {
      page: 1,
      per_page: 10,
    }
  });
  return res.data.data;
};

const Logs: FC<LogsProps> = ({ isLogsOpen, setIsLogsOpen, onNewLogs }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const prevLastLogIdRef = useRef<number | null>(null);

  const { data: logs, error } = useSWR(
    token ? [`${API_BASE_URL}/logs`, token] : null,
    logFetcher,
    { refreshInterval: 15000 }
  );

  useEffect(() => {
    if (logs && logs.length > 0) {
      const latestLogId = logs[0].id;
      if (prevLastLogIdRef.current !== null && latestLogId > prevLastLogIdRef.current) {
        onNewLogs();
      }
      prevLastLogIdRef.current = latestLogId;
    }
  }, [logs, onNewLogs]);

  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      toast.error("Authentication failed. Please log in again.", { position: "top-center" });
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      navigate('/login', { replace: true });
    } else {
      toast.error("Failed to fetch logs.", { position: "top-center" });
    }
  }

  const handleClose = useCallback(() => {
    setIsLogsOpen(false);
  }, [setIsLogsOpen]);

  // Handle side panel opening/closing
  useEffect(() => {
    if (isLogsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLogsOpen]);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isLogsOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Logs</h2>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
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
      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="bg-gray-100 p-3 rounded-lg mb-2 shadow-sm">
              <p className="text-sm text-gray-600">Status: {log.status}</p>
              <p className="text-sm font-semibold">{log.message}</p>
              <p className="text-xs text-gray-400 mt-1">Date: {new Date(log.created_at).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-8">No logs available.</p>
        )}
      </div>
    </div>
  );
};

export default Logs;
