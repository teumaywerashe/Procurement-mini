export function getErrorMessage(error: unknown): string {
  const data = (error as { data?: unknown }).data;
  const msg = (data as { message?: unknown } | undefined)?.message;

  if (Array.isArray(msg)) {
    return msg.join(", ");
  } else if (typeof msg === "string") {
    return msg;
  } else if (Array.isArray(data)) {
    return data.join(", ");
  } else if (typeof data === "string") {
    return data;
  } else {
    return "An error occurred. Please try again.";
  }
}
