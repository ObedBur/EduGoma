import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';
import { UpdateDemoRequestStatusDto } from './dto/update-demo-request-status.dto';

@Injectable()
export class DemoRequestService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Enregistre une nouvelle demande de démonstration.
   * Le statut initial est toujours "nouveau" (géré par le schéma Prisma).
   */
  async create(dto: CreateDemoRequestDto) {
    const demoRequest = await this.prisma.demoRequest.create({
      data: {
        contactName: dto.contactName.trim(),
        schoolName: dto.schoolName.trim(),
        phone: dto.phone.trim(),
        email: dto.email?.trim() ?? null,
        studentRange: dto.studentRange ?? null,
        message: dto.message?.trim() ?? null,
        // status: 'nouveau' est la valeur par défaut dans le schéma Prisma
      },
      select: {
        id: true,
        contactName: true,
        schoolName: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    return demoRequest;
  }

  /**
   * Met à jour le statut d'une demande avec vérification des règles de workflow.
   * Règles:
   * - nouveau -> contacté, clôturé
   * - contacté -> converti, clôturé
   */
  async updateStatus(id: string, dto: UpdateDemoRequestStatusDto) {
    const request = await this.prisma.demoRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Demande introuvable');
    }

    const oldStatus = request.status;
    const newStatus = dto.status;

    // Si même statut, ne rien faire
    if (oldStatus === newStatus) {
      return request;
    }

    // Validation des transitions (Workflow)
    let isValidTransition = false;

    if (oldStatus === 'nouveau' && (newStatus === 'contacté' || newStatus === 'clôturé')) {
      isValidTransition = true;
    } else if (oldStatus === 'contacté' && (newStatus === 'converti' || newStatus === 'clôturé')) {
      isValidTransition = true;
    }

    if (!isValidTransition) {
      throw new BadRequestException(
        `Transition de statut invalide : impossible de passer de '${oldStatus}' à '${newStatus}'`
      );
    }

    return this.prisma.demoRequest.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  /**
   * Liste toutes les demandes (usage admin — issue #8).
   */
  async findAll() {
    return this.prisma.demoRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Récupère une demande par son id (usage admin — issue #8).
   */
  async findOne(id: string) {
    const request = await this.prisma.demoRequest.findUnique({
      where: { id },
    });
    
    if (!request) {
      throw new NotFoundException('Demande introuvable');
    }
    
    return request;
  }
}
