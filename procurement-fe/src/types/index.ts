export interface CollectionQuery {
  q?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface CollectionResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type TenderStatus =
  | "draft"
  | "published"
  | "closed"
  | "awarded"
  | "cancelled";

export interface Tender {
  id: number;
  title: string;
  name: string;
  description?: string;
  status: TenderStatus;
  closingDate: Date;
  referenceNumber: string;
  estimatedValue: number;
  createdAt: string;
  createdBy: number;
  bids?: Bid[];
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "SuperAdmin" | "Admin" | "Vendor";
  createdAt: Date | string;
}

export interface Vendor {
  id: number;
  userId: number;
  name: string;
  phoneNumber?: string;
  email?: string;
  createdAt: string;
  bids?: Bid[];
}

export interface Bid {
  id: number;
  tenderId: number;
  vendorId: number;
  amount: number;
  bidStatus: "pending" | "accepted" | "rejected";
  submittedAt: string;
  createdAt?: string;
  referenceNumber: string;
  tender?: Tender;
  vendor?: Vendor;
  proposedPrice?: number;
  proposal?: string;
  notes?: string;
}

export interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

export interface FormState {
  title: string;
  name: string;
  description: string;
  status: TenderStatus;
  closingDate: string;
  estimatedValue: string;
}
