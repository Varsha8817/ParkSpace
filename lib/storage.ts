import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const DEFAULT_BUCKET = "parking-images";

export const parkingImagesBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

export async function uploadParkingImages(files: File[], ownerId: string) {
  if (!files.length) return [];

  if (!isSupabaseConfigured || !supabase) {
    return Promise.all(files.map((file) => fileToDataUrl(file)));
  }

  const client = supabase;

  const uploads = await Promise.all(
    files.map(async (file) => {
      const path = `${ownerId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}-${sanitizeFileName(file.name)}`;

      const { error } = await client.storage
        .from(parkingImagesBucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data } = client.storage.from(parkingImagesBucket).getPublicUrl(path);
      return data.publicUrl;
    })
  );

  return uploads;
}
