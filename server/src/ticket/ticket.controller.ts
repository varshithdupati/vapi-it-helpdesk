import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { EmployeeService } from '../employee/employee.service';

/**
 * Ticket Controller
 * 
 * Handles IT ticket creation and listing.
 * The POST endpoint is called by the Vapi voice agent via the `create_ticket` tool.
 */
@Controller('tickets')
export class TicketController {
  private readonly logger = new Logger(TicketController.name);

  constructor(
    private readonly ticketService: TicketService,
    private readonly employeeService: EmployeeService,
  ) {}

  /**
   * POST /api/tickets
   * 
   * Creates a new IT support ticket.
   * 
   * Used by Vapi tool: create_ticket(employeeId, deviceAssetTag, issueSummary)
   * 
   * Validates that:
   * - Employee exists
   * - Device exists and belongs to the employee
   * 
   * @returns Created ticket with ticket number
   */
  @Post()
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    const { employeeId, deviceAssetTag, issueSummary } = createTicketDto;

    this.logger.log(`Creating ticket for employee ${employeeId}, device ${deviceAssetTag}`);

    // Validate employee exists
    const employee = await this.employeeService.findById(employeeId);
    if (!employee) {
      this.logger.warn(`Ticket creation failed: Employee ${employeeId} not found`);
      throw new BadRequestException({
        error: 'Invalid employee ID',
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    // Validate device belongs to employee
    const deviceValid = await this.employeeService.verifyDeviceOwnership(
      employeeId,
      deviceAssetTag,
    );
    if (!deviceValid) {
      this.logger.warn(
        `Ticket creation failed: Device ${deviceAssetTag} not found for employee ${employeeId}`,
      );
      throw new BadRequestException({
        error: 'Invalid device',
        message: `Device ${deviceAssetTag} is not assigned to employee ${employeeId}`,
      });
    }

    // Create the ticket
    const ticket = await this.ticketService.create({
      employeeId,
      deviceAssetTag,
      issueSummary,
    });

    this.logger.log(`Created ticket ${ticket.ticketNumber} for employee ${employeeId}`);

    return {
      ticketNumber: ticket.ticketNumber,
      employeeId: ticket.employeeId,
      deviceAssetTag: ticket.deviceAssetTag,
      issueSummary: ticket.issueSummary,
      status: ticket.status,
      createdAt: ticket.createdAt.toISOString(),
    };
  }

  /**
   * GET /api/tickets
   * 
   * Lists all tickets (most recent first).
   * Useful for debugging and demo purposes.
   */
  @Get()
  async listTickets() {
    this.logger.log('Listing all tickets');

    const tickets = await this.ticketService.findAll();

    return tickets.map((ticket) => ({
      ticketNumber: ticket.ticketNumber,
      employeeId: ticket.employeeId,
      deviceAssetTag: ticket.deviceAssetTag,
      issueSummary: ticket.issueSummary,
      status: ticket.status,
      createdAt: ticket.createdAt.toISOString(),
    }));
  }
}

