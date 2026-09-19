import axios from 'axios';
import {
  Standard,
  StandardDetail,
  RelationshipItem,
  AnalysisResponse,
  GraphResponse,
  HistoryItem,
  HealthResponse,
} from '../types';

/**
 * Centralized API Base URL Configuration:
 * - If VITE_API_URL is configured (e.g., in production on Vercel: "https://manaksetu-api.onrender.com"):
 *   normalizes trailing slashes and ensures the path ends with "/api".
 * - If VITE_API_URL is omitted or empty (local development):
 *   falls back to "/api", which is proxied by Vite to the local FastAPI backend.
 */
const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`)
  : '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Guard against duplicate /api in path when baseURL already ends with /api
apiClient.interceptors.request.use((config) => {
  if (config.url) {
    if (config.baseURL?.endsWith('/api')) {
      if (config.url === '/api') {
        config.url = '';
      } else if (config.url.startsWith('/api/')) {
        config.url = config.url.substring(4);
      }
    }
  }
  return config;
});

export const api = {
  // Requirement Analysis
  async analyzeRequirement(requirement: string, llm_provider: string = 'none'): Promise<AnalysisResponse> {
    const res = await apiClient.post<AnalysisResponse>('/analyze', {
      requirement,
      llm_provider,
    });
    return res.data;
  },

  // Standards
  async getStandards(params?: { q?: string; classification?: string; status?: string }): Promise<Standard[]> {
    const res = await apiClient.get<Standard[]>('/standards', { params });
    return res.data;
  },

  async getStandardDetail(id: number): Promise<StandardDetail> {
    const res = await apiClient.get<StandardDetail>(`/standards/${id}`);
    return res.data;
  },

  async getStandardRelationships(id: number): Promise<RelationshipItem[]> {
    const res = await apiClient.get<RelationshipItem[]>(`/standards/${id}/relationships`);
    return res.data;
  },

  // Knowledge Graph
  async getKnowledgeGraph(centralId: number = 1, relationshipType?: string): Promise<GraphResponse> {
    const res = await apiClient.get<GraphResponse>('/graph', {
      params: {
        central_id: centralId,
        relationship_type: relationshipType,
      },
    });
    return res.data;
  },

  // History
  async getHistory(): Promise<HistoryItem[]> {
    const res = await apiClient.get<HistoryItem[]>('/history');
    return res.data;
  },

  async getHistoryDetail(id: string): Promise<AnalysisResponse> {
    const res = await apiClient.get<AnalysisResponse>(`/history/${id}`);
    return res.data;
  },

  // System Health
  async getHealth(): Promise<HealthResponse> {
    const res = await apiClient.get<HealthResponse>('/health');
    return res.data;
  },
};
