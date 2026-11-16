import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useConversations(filters = {}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.classification) params.classification = filters.classification;
      if (filters.segment) params.segment = filters.segment;
      if (filters.status) params.status = filters.status;
      if (filters.accountSource) params.accountSource = filters.accountSource;
      if (filters.search) params.search = filters.search;
      const res = await axios.get(`${API_URL}/api/conversations`, { params });
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    filters.classification,
    filters.segment,
    filters.status,
    filters.accountSource,
    filters.search,
  ]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations, setConversations };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/conversations/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}

export async function patchConversation(id, payload) {
  const res = await axios.patch(`${API_URL}/api/conversations/${id}`, payload);
  return res.data;
}

export async function regenerateDraft(id) {
  const res = await axios.post(`${API_URL}/api/conversations/${id}/regenerate-draft`);
  return res.data;
}

export async function createIncomingEmail(payload) {
  const res = await axios.post(`${API_URL}/api/conversations/incoming`, payload);
  return res.data;
}
