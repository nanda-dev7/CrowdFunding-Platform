import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationRead } from "../api/notificationApi";
import { useAuthStore } from "../store/authStore";

export function useNotifications() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: isAuthenticated,
    refetchInterval: 45_000,
    select: (data) => {
      const list = data?.notifications || data?.items || data;
      return Array.isArray(list) ? list : [];
    },
  });
  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  return {
    notifications: query.data || [],
    unreadCount: (query.data || []).filter((item) => !item.read && !item.isRead).length,
    isLoading: query.isLoading,
    markRead: readMutation.mutate,
  };
}
