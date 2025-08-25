import { StallStatus } from './enums';

export interface User {
  _id: string;
  name: string;
  yearOfBirth: number;
  gender: string;
  phoneNumber: string;
  email: string;
  created: Date;
  userRoles: string[]
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
  createdAt: string;
  updatedAt: string;
}


