// ============================================
// TIPOS DE USUARIO Y AUTENTICACIÓN
// ============================================

import { UserRole } from "@prisma/client";

export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthSession {
  user: IUser;
  expires: string;
}

export type AuthCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterCredentials = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

// ============================================
// TIPOS DE ÓRDENES
// ============================================

import { OrderStatus, PaymentStatus } from "@prisma/client";

export interface IOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  installationRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ============================================
// TIPOS DE PRODUCTOS
// ============================================

export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
}

export interface IProductWithDetails extends IProduct {
  description: string;
  images: string[];
  specifications?: Record<string, any>;
}

// ============================================
// TIPOS DE VALIDACIÓN
// ============================================

export type ValidationError = {
  field: string;
  message: string;
};

export type FormErrors = Record<string, string>;
