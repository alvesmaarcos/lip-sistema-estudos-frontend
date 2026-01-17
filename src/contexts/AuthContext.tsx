/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  logout as logoutApi,
  verifyEmail as verifyEmailApi,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from "@/http/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    code: string,
    email: string,
    newPassword: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (storedToken && userId && userName) {
      setToken(storedToken);
      setUser({
        id: Number(userId),
        name: userName,
        email: userEmail || "",
      });
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      localStorage.clear();

      const response = await loginUser({ email, password });

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userId", String(response.userId));
      localStorage.setItem("userName", response.name);
      localStorage.setItem("userEmail", response.email);

      setToken(response.accessToken);
      setUser({
        id: response.userId,
        name: response.name,
        email: response.email,
      });

      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Credenciais inválidas";
      toast.error("Erro no login", { description: errorMessage });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await registerUser({ name, email, password });
      toast.success("Cadastro realizado!", {
        description: "Verifique seu email para ativar a conta.",
      });
    } catch (error) {
      toast.error("Erro no cadastro");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.clear();
      navigate("/login");
    }
  };

  const verifyEmail = async (token: string) => {
    await verifyEmailApi(token);
  };

  const forgotPassword = async (email: string) => {
    try {
      await forgotPasswordApi(email);
      toast.success("Email enviado!");
    } catch {
      toast.error("Erro ao enviar email");
    }
  };

  const resetPassword = async (
    code: string,
    email: string,
    newPassword: string,
  ) => {
    try {
      await resetPasswordApi({ code, email, newPassword });
      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch {
      toast.error("Erro ao redefinir senha");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
