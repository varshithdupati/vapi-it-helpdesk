import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateTicketData {
  employeeId: string;
  deviceAssetTag: string;
  issueSummary: string;
}

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new IT support ticket
   * Generates ticket number as "IT-{id}"
   */
  async create(data: CreateTicketData) {
    // First, create the ticket to get the auto-incremented ID
    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber: 'TEMP', // Temporary, will update
        employeeId: data.employeeId,
        deviceAssetTag: data.deviceAssetTag,
        issueSummary: data.issueSummary,
        status: 'OPEN',
      },
    });

    // Update with the proper ticket number based on ID
    const updatedTicket = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { ticketNumber: `IT-${ticket.id}` },
    });

    this.logger.log(`Created ticket: ${updatedTicket.ticketNumber}`);

    return updatedTicket;
  }

  /**
   * Find all tickets, ordered by creation date (newest first)
   */
  async findAll() {
    return this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a ticket by ticket number
   */
  async findByTicketNumber(ticketNumber: string) {
    return this.prisma.ticket.findUnique({
      where: { ticketNumber },
    });
  }
}

