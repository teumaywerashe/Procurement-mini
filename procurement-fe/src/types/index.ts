export type TenderStatus = "draft" | "published" | "closed" | "awarded" | "cancelled";

export interface Tender {
  id: number;
  title: string;
  name: string;
  description?: string;
  status: TenderStatus;
  closingDate: string;
  referenceNumber: string;
  estimatedValue: number;
  createdAt: string;
  createdBy: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "vendor";
  createdAt: Date;
}

export interface Vendor {
  id: number;
  userId: number;
  companyName: string;
  contactPhone?: string;
  address?: string;
  createdAt: string;
}

export interface Bid {
  id: number;
  tenderId: number;
  vendorId: number;
  amount: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}


export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}