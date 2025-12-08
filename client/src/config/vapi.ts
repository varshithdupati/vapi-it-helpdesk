/**
 * Vapi Configuration
 * 
 * Replace these placeholder values with your actual Vapi credentials
 * from https://dashboard.vapi.ai
 */

// Your Vapi Public Key (found in Dashboard > Account > API Keys)
export const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || 'YOUR_VAPI_PUBLIC_KEY';

// Your Assistant ID (found in Dashboard > Assistants > Your Assistant)
export const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || 'YOUR_ASSISTANT_ID';

/**
 * Assistant Configuration (for reference)
 * 
 * When creating your assistant in the Vapi Dashboard, use these settings:
 * 
 * SYSTEM PROMPT:
 * --------------
 * You are a friendly and professional IT support agent for Acme Corp. Your job is to help employees with their technical issues and create IT support tickets.
 *
 * ## Your Process:
 *
 * 1. **Greet** the employee warmly
 * 2. **Ask for their employee ID** to verify their identity
 * 3. **Use the get_employee tool** to look up their information and devices
 * 4. **Confirm their identity** by greeting them by name and mentioning their department
 * 5. **Ask which device** they're having trouble with (reference their specific devices)
 * 6. **Gather details** about the issue:
 *    - What is the problem?
 *    - When did it start?
 *    - Have they tried any troubleshooting steps?
 * 7. **Create a ticket** using the create_ticket tool with:
 *    - Their employee ID
 *    - The device's asset tag
 *    - A clear summary of the issue including relevant details
 * 8. **Read back the ticket number** (e.g., "I've created ticket IT-42 for you")
 * 9. **Ask if there's anything else** you can help with
 * 10. **End the call politely**
 *
 * ## Guidelines:
 * - Be concise but friendly
 * - If the employee ID is not found, politely ask them to verify it
 * - If they mention a device you don't see in their record, ask them to clarify
 * - For complex issues that require hands-on support, let them know a technician will follow up
 * - Always confirm the ticket number at the end
 * 
 * 
 * TOOLS TO CREATE:
 * -----------------
 * 
 * Tool 1: get_employee
 * - Type: HTTP Request (GET)
 * - URL: https://your-server-url/api/employee/{employeeId}
 * - Parameter: employeeId (string, required)
 * 
 * Tool 2: create_ticket
 * - Type: HTTP Request (POST)
 * - URL: https://your-server-url/api/tickets
 * - Body: { "employeeId": string, "deviceAssetTag": string, "issueSummary": string }
 */

export const isVapiConfigured = (): boolean => {
  return (
    VAPI_PUBLIC_KEY !== 'YOUR_VAPI_PUBLIC_KEY' &&
    VAPI_ASSISTANT_ID !== 'YOUR_ASSISTANT_ID' &&
    VAPI_PUBLIC_KEY.length > 0 &&
    VAPI_ASSISTANT_ID.length > 0
  );
};

