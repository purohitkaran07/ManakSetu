export interface Standard {
  id: number;
  standard_number: string;
  title: string;
  scope: string;
  standard_type: string;
  classification: string;
  certification_status: string;
  status: string;
  year: number;
  description?: string;
  source_reference?: string;
  meta_info?: Record<string, any>;
}

export interface RelationshipItem {
  id: number;
  relationship_type: string;
  related_standard_id: number;
  related_standard_number: string;
  related_standard_title: string;
  direction: 'outgoing' | 'incoming';
}

export interface StandardDetail extends Standard {
  relationships: RelationshipItem[];
}

export interface StructuredRequirement {
  product?: string | null;
  product_category?: string | null;
  quantity?: number | null;
  specifications: Record<string, any>;
  application?: string | null;
  installation?: string | null;
  procurement_context?: string | null;
  explicitly_mentioned_standards: string[];
  inferred_fields: string[];
}

export interface VersionAlert {
  alert_type: string;
  explicit_standard: string;
  superseding_standard: string;
  message: string;
}

export interface RecommendationItem {
  standard: Standard;
  reason: string;
  evidence: string[];
  relevance: number;
  confidence: 'High' | 'Medium' | 'Low';
  certification_status: string;
}

export interface AnalysisResponse {
  id: string;
  original_requirement: string;
  structured_requirement: StructuredRequirement;
  recommendations: RecommendationItem[];
  candidate_standards: RecommendationItem[];
  version_alerts: VersionAlert[];
  created_at: string;
}

export interface PDFExtractResponse {
  text: string;
  filename?: string;
  pages_count?: number;
}


export interface GraphNodeData extends Record<string, unknown> {
  id: number;
  standard_number: string;
  title: string;
  standard_type: string;
  status: string;
  certification_status: string;
  year: number;
  is_central?: boolean;
}

export interface GraphNode {
  id: string;
  type?: string;
  data: GraphNodeData;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  animated?: boolean;
  type?: string;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface HistoryItem {
  id: string;
  original_requirement: string;
  product?: string | null;
  recommendations_count: number;
  top_standards: string[];
  has_version_alerts: boolean;
  created_at: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  database: {
    status: string;
    standards_count: number;
  };
  model: {
    name: string;
    embedding_dim: number;
    status: string;
  };
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignUpRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}
