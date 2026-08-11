export function getErrorMessage(error: unknown): string {
  const data = (error as { data?: unknown })?.data;

  if (!data || typeof data !== "object") {
    return "An error occurred. Please try again.";
  }

  const message = (data as { message?: unknown }).message;

  if (message && typeof message === "object") {
    const nestedMessage = (message as { message?: unknown }).message;

    if (typeof nestedMessage === "string") {
      return nestedMessage;
    }
  }

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string") {
    return message;
  }

  if (typeof data === "string") {
    return data;
  }

  return "An error occurred. Please try again.";
}
