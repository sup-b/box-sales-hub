import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNotificationSettings = () =>
  useQuery({
    queryKey: ["notification_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notification_settings").select("*");
      if (error) throw error;
      const map: Record<string, boolean> = {};
      data.forEach((row) => (map[row.key] = row.enabled));
      return map;
    },
  });

export const useToggleNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
      const { error } = await supabase
        .from("notification_settings")
        .update({ enabled })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification_settings"] }),
  });
};
