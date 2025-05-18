// seedAdmin.ts
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Role, UserStatus } from '@prisma/client';
import prisma from './prisma/prisma-client'; // adjust path if needed

dotenv.config();

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
    const adminPass = process.env.ADMIN_PASS ?? 'admin123';

    // Check if an ADMIN user already exists
    const existing = await prisma.user.findFirst({
      where: { role: Role.ADMIN }
    });

    if (existing) {
      console.log(`Admin already exists: ${existing.email}`);
      return;
    }

    // Hash the password
    const hashed = await bcrypt.hash(adminPass, 10);

    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: hashed,
        role: Role.ADMIN,
        status: UserStatus.ENABLED,
        // no vehiclePlateNumber for admin
      }
    });
    

    console.log(`✔️  Admin user created: ${admin.email}`);
  } catch (err: any) {
    console.error('❌ Error seeding admin:', err.message ?? err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

//ts-node seedAdmin.ts
// # or, if compiled:
// node dist/seedAdmin.js
seedAdmin();
