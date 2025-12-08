import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a new IT ticket
 * 
 * This is the request body expected by POST /api/tickets
 * Used by Vapi tool: create_ticket(employeeId, deviceAssetTag, issueSummary)
 */
export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  deviceAssetTag: string;

  @IsString()
  @IsNotEmpty()
  issueSummary: string;
}

