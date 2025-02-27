import { supabase } from "../lib/supabase";

export const uploadImage = async (file, fileName) => {
  const { data, error } = await supabase.storage
    .from("gambar") // Ganti dengan nama bucket yang kamu buat
    .upload(`gambar/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return data.path; // Mengembalikan path gambar di storage
};
