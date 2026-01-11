import { api } from "./index";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ message: string }> {
  const response = await api.post("/user/create", data);
  return response.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{
  accessToken: string;
  refreshToken: string;
  userId: number;
  name: string;
  email: string;
}> {
  const response = await api.post("/auth/login", data);

  // Salvar tokens no localStorage
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
  localStorage.setItem("userId", response.data.userId.toString());
  localStorage.setItem("userName", response.data.name);

  return response.data;
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const response = await api.get(`/auth/verificar-email?token=${token}`);
  return response.data;
}

export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword(data: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
}

export async function logout(): Promise<MessageResponse> {
  const response = await api.post("/auth/logout");
  localStorage.clear();
  return response.data;
}

export async function refreshToken(): Promise<AuthResponse> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const response = await api.post("/auth/refresh-token", { refreshToken });

  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);

  return response.data;
}
