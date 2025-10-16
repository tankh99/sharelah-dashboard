import { StallStatus, UserRole, PromoCodeType } from './enums';

export interface User {
  _id: string;
  name: string;
  yearOfBirth: number;
  gender: string;
  phoneNumber: string;
  email: string;
  created: string | null;
  userRoles: UserRole[];
  hasFreeSignup: boolean;
  usedPromoCodes: string[]
}

export interface Stall {
  _id: string;
  name: string;
  code: string;
  deviceName: string;
  location: number[]
  umbrellaCount: number;
  status: StallStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id: string;
  user: User | null;
  stall: Stall | null;
  amount: number;
  borrowDate: string | null;
  returnDate: string | null;
  created: string;
}

export interface PromoCode {
  _id: string;
  code: string;
  type: PromoCodeType;
  value: number;
  maxUses: number;
  timesUsed: number;
  expiresAt: Date | null;
  isActive: boolean;
  minPurchase: number;
}


