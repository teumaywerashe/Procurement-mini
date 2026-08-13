export function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    // 1 hour max-age matching JWT expiration
    document.cookie = `access_token=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
  }
}

export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
}
