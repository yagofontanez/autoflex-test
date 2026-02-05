import axios from "axios";

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = (err.response?.data as any)?.message;
    return msg || err.message || "Request failed";
  }
  return "Unexpected error";
}
