import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMe, loginUser, logoutUser, registerUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

const dashboardFor = (role) => {
  if (role === "admin") return "/dashboard/admin";
  if (role === "campaigner") return "/dashboard/campaigner";
  return "/dashboard/donor";
};

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, setAuth, setUser, logout } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
    select: (data) => data.user || data,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const nextUser = data.user || data.data?.user;
      const nextToken = data.token || data.accessToken || data.data?.token;
      setAuth({ user: nextUser, token: nextToken });
      toast.success("Welcome back to AniRescue");
      navigate(dashboardFor(nextUser?.role));
    },
    onError: (error) => toast.error(error.response?.data?.message || "Login failed"),
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const nextUser = data.user || data.data?.user;
      const nextToken = data.token || data.accessToken || data.data?.token;
      setAuth({ user: nextUser, token: nextToken });
      toast.success("Account created successfully");
      navigate(dashboardFor(nextUser?.role));
    },
    onError: (error) => toast.error(error.response?.data?.message || "Registration failed"),
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      logout();
      queryClient.clear();
      navigate("/");
    },
  });

  useEffect(() => {
    if (meQuery.data && meQuery.data !== user) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser, user]);

  return {
    user: meQuery.data || user,
    token,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || meQuery.isLoading,
  };
}
