import supabase from "~/supabase";
import { v4 as uuidv4 } from "uuid";

async function getToken(id: string, bucket: string) {
  const { data } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(`${id}.png`);
  return data?.token;
}

async function uploadImage(file: File | Blob, bucket = "PostGallery") {
  try {
    const id = uuidv4();

    // Create a new File object with .png extension
    const imageFile = new File([file], `${id}.png`, {
      type: "image/png",
    });

    const token = await getToken(id, bucket);
    if (!token) {
      throw new Error("Failed to get upload token");
    }

    const { data } = await supabase.storage
      .from(bucket)
      .uploadToSignedUrl(`${id}.png`, token, imageFile);

    if (!data) {
      throw new Error("Upload failed");
    }

    return data.fullPath as string;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export default uploadImage;
