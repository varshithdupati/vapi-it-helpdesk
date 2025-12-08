import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find an employee by their ID, including their devices
   */
  async findById(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: { devices: true },
    });
  }

  /**
   * Verify that a device belongs to an employee
   */
  async verifyDeviceOwnership(employeeId: string, assetTag: string): Promise<boolean> {
    const device = await this.prisma.device.findFirst({
      where: {
        assetTag,
        employeeId,
      },
    });
    return device !== null;
  }
}

