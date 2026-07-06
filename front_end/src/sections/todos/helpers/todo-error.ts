import type { ApiClientError } from "@/lib/api-client";

const isApiClientError = (error: unknown): error is ApiClientError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "success" in error &&
    (error as ApiClientError).success === false
  );
};

export const isTodoDuplicateError = (error: unknown) => {
  return isApiClientError(error) && error.error?.code === "TODO_DUPLICATE";
};
