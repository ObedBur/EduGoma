import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { DemoRequestService } from './demo-request.service';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';

@Controller('demo-requests')
export class DemoRequestController {
  constructor(private readonly demoRequestService: DemoRequestService) {}

  /**
   * POST /demo-requests
   *
   * Endpoint public — reçoit une demande de démonstration depuis la landing page.
   * Protégé par un rate limiting strict (5 requêtes / minute / IP).
   * La validation est entièrement gérée par le ValidationPipe global + le DTO.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async create(@Body() dto: CreateDemoRequestDto) {
    const result = await this.demoRequestService.create(dto);
    return {
      success: true,
      message:
        'Votre demande a bien été enregistrée. Nous vous contacterons dans les 24 heures.',
      data: result,
    };
  }
}
