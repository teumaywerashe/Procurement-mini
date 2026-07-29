// utils/getErrorMessage.ts
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getErrorMessage(error: unknown): string {
  const data = (error as { data?: unknown }).data;
  const msg = (data as { message?: unknown } | undefined)?.message;
  if (Array.isArray(msg)) {
    return msg.join(", ");
  } else if (typeof msg === "object" && msg !== null && "message" in msg) {
    return (msg as { message: string }).message;
  } else if (typeof msg === "string") {
    return msg;
  } else if (typeof data === "string") {
    return data;
  } else {
    return "An error occurred. Please try again.";
  }
}
