import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { TicketService } from './ticket.service';

@Controller('admin/support')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('tickets')
  async getTickets(@Query() query: TicketQueryDto) {
    const limit = query.limit ?? 10;
    const data = await this.ticketService.getTickets(query.status, query.priority, limit);
    return { success: true, count: data.length, data };
  }

  @Get('tickets/stats')
  async getTicketStats() {
    const data = await this.ticketService.getTicketStats();
    return { success: true, data };
  }
}
