import toast from "react-hot-toast";

export interface ApiError {
  response?: {
    status: number;
    data?: {
      detail?: string;
      message?: string;
    };
  };
  message: string;
  code?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred";
  
  const apiError = error as ApiError;
  
  // Check for API response error details
  if (apiError.response?.data?.detail) {
    return apiError.response.data.detail;
  }
  
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }
  
  // Check for standard error message
  if (apiError.message) {
    return apiError.message;
  }
  
  // Fallback for unknown error types
  if (typeof error === "string") {
    return error;
  }
  
  return "An unexpected error occurred";
};

export const getErrorType = (error: unknown): "network" | "client" | "server" | "unknown" => {
  const apiError = error as ApiError;
  
  if (!apiError.response) {
    return "network";
  }
  
  const status = apiError.response.status;
  
  if (status >= 400 && status < 500) {
    return "client";
  }
  
  if (status >= 500) {
    return "server";
  }
  
  return "unknown";
};

export const shouldRetry = (error: unknown): boolean => {
  const errorType = getErrorType(error);
  const apiError = error as ApiError;
  
  // Don't retry client errors (4xx)
  if (errorType === "client") {
    return false;
  }
  
  // Don't retry specific errors
  if (apiError.response?.status === 404) {
    return false;
  }
  
  // Retry network and server errors
  return errorType === "network" || errorType === "server";
};

export const showErrorToast = (error: unknown, customMessage?: string) => {
  const message = customMessage || getErrorMessage(error);
  const errorType = getErrorType(error);
  
  let toastOptions = {
    style: {
      background: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #ef4444',
    },
    duration: 5000,
  };
  
  // Adjust duration based on error type
  if (errorType === "network") {
    toastOptions.duration = 8000; // Longer for network errors
  }
  
  toast.error(message, toastOptions);
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    style: {
      background: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #10b981',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#1e293b',
    },
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #f59e0b',
    },
    duration: 6000,
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #3b82f6',
    },
    duration: 4000,
  });
};