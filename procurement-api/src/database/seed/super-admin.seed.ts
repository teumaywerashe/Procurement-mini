/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../schema/user.schema';
import { UserRole } from '../../user/enum/userRole.enum';

/**
 * Runs once at application startup.
 * Creates a SUPER_ADMIN account if one does not already exist.
 *
 * Required environment variables:
 *   SUPER_ADMIN_NAME
 *   SUPER_ADMIN_EMAIL
 *   SUPER_ADMIN_PASSWORD
 */
@Injectable()
export class SuperAdminSeed implements OnApplicationBootstrap {
  private readonly logger = new Logger(SuperAdminSeed.name);

  async onApplicationBootstrap() {
    const name = process.env.SUPER_ADMIN_NAME;
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!name || !email || !password) {
      this.logger.warn(
        'SUPER_ADMIN_NAME / SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD not set — skipping super admin seed.',
      );
      return;
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (existing) {
      // Already exists — ensure the role is SuperAdmin in case it was changed
      if (existing.role !== UserRole.SUPER_ADMIN) {
        await db
          .update(users)
          .set({ role: UserRole.SUPER_ADMIN })
          .where(eq(users.email, email))
          .execute();
        this.logger.log(`Promoted existing user "${email}" to SuperAdmin.`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      })
      .execute();

    this.logger.log(`SuperAdmin account created for "${email}".`);
  }
}
