import { StallStatus, UserRole, UserGender, UserStatus } from './enums';

export interface User {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: UserGender;
  phoneNumber: string;
  email: string;
  password: string;
  verifyPassword: string;
  roles: UserRole[];
  deviceId: string;
  facebookId: string;
  status: UserStatus;
  properties: string[];
  createdAt: Date;
  updatedAt: Date;
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
  id: string;
  user: User | null;
  stall: Stall | null;
  amount: number;
  borrowDate: Date | null;
  returnDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


