import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseFormSubmitOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useFormSubmit = (options: UseFormSubmitOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submit = useCallback(
    async (submitFn: () => Promise<any>) => {
      // Prevent multiple submissions
      if (isSubmitting || hasSubmitted) {
        return;
      }

      setIsSubmitting(true);
      setHasSubmitted(true);

      try {
        await submitFn();
        
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        
        options.onSuccess?.();
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || error.message || 'An error occurred';
        
        if (options.errorMessage) {
          toast.error(options.errorMessage);
        } else {
          toast.error(errorMsg);
        }
        
        options.onError?.(errorMsg);
      } finally {
        setIsSubmitting(false);
        // Reset after a delay to allow re-submission
        setTimeout(() => setHasSubmitted(false), 1000);
      }
    },
    [isSubmitting, hasSubmitted, options]
  );

  return { submit, isSubmitting };
};
