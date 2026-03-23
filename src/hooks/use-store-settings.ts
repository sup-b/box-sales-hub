import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type StoreSettings = Tables<"store_settings">;

export const useStoreSettings = () =>
  useQuery({
    queryKey: ["store_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("store_settings").select("*").limit(1).single();
      if (error) throw error;
      return data as StoreSettings;
    },
  });

export const useUpdateStoreSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<StoreSettings> & { id: string }) => {
      const { id, ...rest } = settings;
      const { error } = await supabase.from("store_settings").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store_settings"] }),
  });
};
