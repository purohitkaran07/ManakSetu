import axios from 'axios';
import {
  Standard,
  StandardDetail,
  RelationshipItem,
  AnalysisResponse,
  PDFExtractResponse,
  GraphResponse,
  HistoryItem,
  HealthResponse,
  User,
  AuthResponse,
  SignUpRequest,
  LoginRequest,
  MessageResponse,
} from '../types';

/**
 * Production-ready API Base URL resolution:
 * 1. If VITE_API_URL is configured (e.g. in Vercel environment variables), normalize and use it.
 * 2. In production mode (Vercel deployment), default directly to the live Render backend:
 *    https://manaksetu-api.onrender.com/api
 * 3. In local development, fall back to '/api', which is proxied by Vite to http://127.0.0.1:8000.
 */
const getBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  if (import.meta.env.PROD) {
    return 'https://manaksetu-api.onrender.com/api';
  }
  return '/api';
};

export const API_BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Guard against duplicate /api in path and attach auth token if available
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

  const token = localStorage.getItem('manaksetu_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const api = {
  // Authentication
  async signup(data: SignUpRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/signup', data);
    return res.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },

  async logout(): Promise<MessageResponse> {
    const res = await apiClient.post<MessageResponse>('/auth/logout');
    return res.data;
  },

  // PDF Text Extraction
  async extractPdf(file: File): Promise<PDFExtractResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<PDFExtractResponse>('/extract-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

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
