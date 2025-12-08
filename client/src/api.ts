import { Employee, Ticket, CreateTicketRequest } from './types';

/**
 * API utility for the Acme IT Helpdesk backend
 * 
 * In development, Vite proxies /api requests to localhost:3001
 * In production, set VITE_API_BASE_URL to your deployed backend URL
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Fetch employee by ID
 * Used by Vapi tool: get_employee(employeeId)
 */
export async function getEmployee(employeeId: string): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/api/employee/${employeeId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Employee not found');
    }
    throw new Error('Failed to fetch employee');
  }
  
  return response.json();
}

/**
 * Create a new IT ticket
 * Used by Vapi tool: create_ticket(employeeId, deviceAssetTag, issueSummary)
 */
export async function createTicket(data: CreateTicketRequest): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create ticket');
  }
  
  return response.json();
}

/**
 * Fetch all tickets (for demo/debugging)
 */
export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  
  return response.json();
}

