import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// La classe hérite de PrismaClient pour obtenir toutes les méthodes CRUD
// (findMany, create, update, etc.) et les méthodes de gestion de la connexion ($connect, $disconnect).
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * onModuleInit est appelé par NestJS lorsque le module est initialisé.
   * Nous utilisons cette méthode pour tester et établir la connexion à la base de données.
   */
  async onModuleInit() {
    try {
      // Établit la connexion au démarrage.
      // Bien que Prisma supporte le "lazy connect" (connexion à la première requête),
      // forcer la connexion ici permet de détecter immédiatement les erreurs de configuration
      // de la base de données lors du lancement de l'application.
      await this.$connect();
      console.log('Prisma Client: Connexion à la base de données établie avec succès.');
    } catch (error) {
      console.error('Prisma Client: Échec de la connexion à la base de données.', error);
      // Optionnel : Vous pouvez relancer l'erreur ou la gérer si la DB est cruciale.
      // throw error;
    }
  }

  /**
   * onModuleDestroy est appelé par NestJS juste avant que l'application ne s'arrête.
   * Nous utilisons cette méthode pour fermer la connexion à la base de données de manière propre.
   */
  async onModuleDestroy() {
    // Ferme la connexion du client Prisma.
    await this.$disconnect();
    console.log('Prisma Client: Déconnexion de la base de données effectuée.');
  }

  // Des méthodes personnalisées peuvent être ajoutées ici si nécessaire,
  // mais la plupart des opérations peuvent être effectuées directement via 'this.nomDeVotreModele'.
}
