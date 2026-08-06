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
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Vendor";
  createdAt: Date;
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
  referenceNumber: string;
  tender?: Tender;
}

export interface AuthResponse {
  access_token: string;
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
