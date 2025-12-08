/**
 * Vapi Configuration
 *
 * Configure these values via environment variables:
 *   VITE_VAPI_PUBLIC_KEY - Your Vapi public key from dashboard.vapi.ai
 *   VITE_VAPI_ASSISTANT_ID - Your assistant ID from Vapi dashboard
 */

export const VAPI_PUBLIC_KEY =
  import.meta.env.VITE_VAPI_PUBLIC_KEY || '';

export const VAPI_ASSISTANT_ID =
  import.meta.env.VITE_VAPI_ASSISTANT_ID || '';

/**
 * Check if Vapi credentials are configured
 */
export const isVapiConfigured = (): boolean => {
  return (
    VAPI_PUBLIC_KEY.length > 0 &&
    VAPI_ASSISTANT_ID.length > 0 &&
    !VAPI_PUBLIC_KEY.startsWith('YOUR_') &&
    !VAPI_ASSISTANT_ID.startsWith('YOUR_')
  );
};
