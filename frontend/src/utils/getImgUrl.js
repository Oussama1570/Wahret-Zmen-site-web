import getBaseUrl from "./baseURL";

function getImgUrl(name) {
  if (!name) {
    return "/default-image.jpg"; // Default placeholder
  }

  // Handle external URLs directly
  if (name.startsWith("http://") || name.startsWith("https://")) {
    return name;
  }

  // Handle uploaded files from backend (compatible with backend upload logic)
  if (name.startsWith("/uploads/") || name.startsWith("uploads/")) {
    return `${getBaseUrl()}${name.startsWith('/') ? name : `/${name}`}`;
  }

  // Handle local file objects (for preview before upload)
  if (name instanceof File) {
    return URL.createObjectURL(name);
  }

  // Local static assets
  return `/${name}`;
}

export { getImgUrl };
