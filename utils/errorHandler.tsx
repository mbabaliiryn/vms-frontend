import axios from "axios";
import { ValidationError } from "yup";
import { toast } from "sonner";

interface ErrorHandlerOptions {
  setErrors?: (errors: Record<string, string>) => void;
  customMessage?: string;
}

export const handleError = (err: unknown, options?: ErrorHandlerOptions) => {
  const { setErrors, customMessage } = options || {};

  if (err instanceof ValidationError) {
    const newErrors: Record<string, string> = {};
    err.inner.forEach((error) => {
      if (error.path) {
        newErrors[error.path] = error.message;
      }
    });

    if (setErrors) {
      setErrors(newErrors);
    }

    toast.error(customMessage || "Validation failed", {
      description: "Please fix the errors in the form.",
    });
  } else if (axios.isAxiosError(err)) {
    // Handle Axios errors (API calls)
    const errorMessage =
      err.response?.data?.message || customMessage || "An API error occurred.";

    toast.error("Request failed", {
      description: errorMessage,
    });

    console.error("API Error:", err.response?.data || err.message);
  } else {
    // Handle unexpected errors
    toast.error("Unexpected error", {
      description: customMessage || "Something went wrong. Please try again.",
    });

    console.error("Unexpected Error:", err);
  }
};
