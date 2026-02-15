import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OperatorsModule } from './operators/operators.module';
import { SquadsModule } from './squads/squads.module';
import { GamesModule } from './games/games.module';
import { RankingsModule } from './rankings/rankings.module';
import { PaymentsModule } from './payments/payments.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── Rate Limiting ───────────────────────────────
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 1 minute window
      limit: 100,  // max 100 requests per minute
    }]),

    // ── Core ────────────────────────────────────────
    PrismaModule,
    HealthModule,

    // ── Feature Modules ─────────────────────────────
    AuthModule,
    OperatorsModule,
    SquadsModule,
    GamesModule,
    RankingsModule,
    PaymentsModule,
    AdminModule,
  ],
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
