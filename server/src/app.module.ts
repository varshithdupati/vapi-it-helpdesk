import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { TicketModule } from './ticket/ticket.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [PrismaModule, EmployeeModule, TicketModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger('HTTP');

  configure(consumer: MiddlewareConsumer) {
    // Simple request logging middleware
    consumer
      .apply((req: any, res: any, next: () => void) => {
        const { method, originalUrl } = req;
        const start = Date.now();

        res.on('finish', () => {
          const duration = Date.now() - start;
          this.logger.log(`${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
        });

        next();
      })
      .forRoutes('*');
  }
}

