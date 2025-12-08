import { Controller, Get, Param, NotFoundException, Logger } from '@nestjs/common';
import { EmployeeService } from './employee.service';

/**
 * Employee Controller
 * 
 * This endpoint is called by the Vapi voice agent via the `get_employee` tool
 * to look up employee information and their assigned devices.
 */
@Controller('employee')
export class EmployeeController {
  private readonly logger = new Logger(EmployeeController.name);

  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * GET /api/employee/:id
   * 
   * Retrieves employee information including their assigned devices.
   * 
   * Used by Vapi tool: get_employee(employeeId)
   * 
   * @param id - Employee ID (e.g., "12345")
   * @returns Employee data with devices, or 404 if not found
   */
  @Get(':id')
  async getEmployee(@Param('id') id: string) {
    this.logger.log(`Looking up employee: ${id}`);

    const employee = await this.employeeService.findById(id);

    if (!employee) {
      this.logger.warn(`Employee not found: ${id}`);
      throw new NotFoundException({ error: 'Employee not found' });
    }

    this.logger.log(`Found employee: ${employee.name} with ${employee.devices.length} device(s)`);

    // Format response for Vapi consumption
    return {
      id: employee.id,
      name: employee.name,
      department: employee.department,
      devices: employee.devices.map((device) => ({
        type: device.type,
        assetTag: device.assetTag,
        os: device.os,
      })),
    };
  }
}

