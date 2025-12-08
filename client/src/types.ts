/**
 * Type definitions for the Acme IT Helpdesk
 * These match the backend API response structures
 */

export interface Device {
  type: string;
  assetTag: string;
  os: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  devices: Device[];
}

export interface Ticket {
  ticketNumber: string;
  employeeId: string;
  deviceAssetTag: string;
  issueSummary: string;
  status: string;
  createdAt: string;
}

export interface CreateTicketRequest {
  employeeId: string;
  deviceAssetTag: string;
  issueSummary: string;
}

