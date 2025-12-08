import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateTicketData {
  employeeId: string;
  deviceAssetTag: string;
  issueSummary: string;
}

const MAX_TICKETS = 6;

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new IT support ticket
   * Generates ticket number as "IT-{random 3-digit number}"
   * Auto-cleans old tickets if count exceeds MAX_TICKETS
   */
  async create(data: CreateTicketData) {
    // Generate unique random ticket number
    const ticketNumber = await this.generateUniqueTicketNumber();

    const ticket = await this.prisma.ticket.create({
      data: {
        ticketNumber,
        employeeId: data.employeeId,
        deviceAssetTag: data.deviceAssetTag,
        issueSummary: data.issueSummary,
        status: 'OPEN',
      },
    });

    this.logger.log(`Created ticket: ${ticket.ticketNumber}`);

    // Auto-cleanup: keep only the most recent tickets
    await this.cleanupOldTickets();

    return ticket;
  }

  /**
   * Generate a unique random 3-digit ticket number
   */
  private async generateUniqueTicketNumber(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Generate random 3-digit number (100-999)
      const randomNum = Math.floor(Math.random() * 900) + 100;
      const ticketNumber = `IT-${randomNum}`;

      // Check if it already exists
      const existing = await this.prisma.ticket.findUnique({
        where: { ticketNumber },
      });

      if (!existing) {
        return ticketNumber;
      }

      attempts++;
    }

    // Fallback: use timestamp-based number
    const fallback = `IT-${Date.now() % 1000}`;
    return fallback;
  }

  /**
   * Remove old tickets if count exceeds MAX_TICKETS
   * Keeps the most recent tickets
   */
  private async cleanupOldTickets() {
    const count = await this.prisma.ticket.count();
    
    if (count > MAX_TICKETS) {
      // Get IDs of tickets to keep (most recent)
      const ticketsToKeep = await this.prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' },
        take: MAX_TICKETS,
        select: { id: true },
      });

      const idsToKeep = ticketsToKeep.map(t => t.id);

      // Delete all tickets not in the keep list
      const deleted = await this.prisma.ticket.deleteMany({
        where: {
          id: { notIn: idsToKeep },
        },
      });

      if (deleted.count > 0) {
        this.logger.log(`Cleaned up ${deleted.count} old ticket(s)`);
      }
    }
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

