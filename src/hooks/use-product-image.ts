import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-images";

export const useProductImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
};
