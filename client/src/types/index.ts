export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'frontline' | 'investigator' | 'validator' | 'admin';
  department: string;
  isActive: boolean;
  createdAt: string;
}

export interface CaseNote {
  id: string;
  content: string;
  agentId: string;
  agentName: string;
  timestamp: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  priority: 'tier1' | 'tier2' | 'tier3';
  status: 'open' | 'investigating' | 'blocked' | 'resolved' | 'closed';
  category: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  resolution?: string;
  notes: CaseNote[];
}

export interface ConfigOption {
  value: string;
  label: string;
}

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  agent: Agent;
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  priority: Case['priority'];
  category: string;
  createdBy: string;
}

export interface CaseFilters {
  status?: string;
  assignedTo?: string;
  priority?: string;
  category?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}