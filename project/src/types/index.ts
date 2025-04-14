export type BidStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface Bid {
  id: string;
  name: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  status: BidStatus;
  value: number;
  progress: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'collaborator';
}