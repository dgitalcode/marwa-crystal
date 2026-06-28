export const optimizedImageHosts = new Set([
  "res.cloudinary.com",
  "imgs.search.brave.com",
]);

export function canUseNextImage(src: string) {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    return optimizedImageHosts.has(new URL(src).hostname);
  } catch {
    return false;
  }
}
