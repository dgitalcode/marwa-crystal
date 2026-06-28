import { createHash } from "node:crypto";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured() {
  return getCloudinaryCredentials() !== null;
}

function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string,
) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export function extractCloudinaryPublicId(url: string) {
  if (!url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    const pathname = new URL(url).pathname;
    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) {
      return null;
    }

    const afterUpload = pathname.slice(uploadIndex + "/upload/".length);
    const segments = afterUpload.split("/").filter(Boolean);
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments =
      versionIndex === -1 ? segments : segments.slice(versionIndex + 1);

    if (publicIdSegments.length === 0) {
      return null;
    }

    const publicId = publicIdSegments.join("/").replace(/\.[a-zA-Z0-9]+$/, "");
    return publicId || null;
  } catch {
    return null;
  }
}

export async function uploadImageToCloudinary(
  file: File,
  folder = "marwa-crystal/logos",
) {
  const credentials = getCloudinaryCredentials();
  if (!credentials) {
    throw new Error(
      "Cloudinary n'est pas configure. Definissez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.",
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signCloudinaryParams({ folder, timestamp }, credentials.apiSecret);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", credentials.apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Echec upload Cloudinary: ${error}`);
  }

  const result = (await response.json()) as CloudinaryUploadResult;
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteCloudinaryImage(publicId: string) {
  const credentials = getCloudinaryCredentials();
  if (!credentials) {
    return;
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signCloudinaryParams({ public_id: publicId, timestamp }, credentials.apiSecret);

  const body = new URLSearchParams({
    public_id: publicId,
    api_key: credentials.apiKey,
    timestamp: String(timestamp),
    signature,
  });

  await fetch(`https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/destroy`, {
    method: "POST",
    body,
  });
}
