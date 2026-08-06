import { prisma } from "./prisma.js";
import bcrypt from "bcrypt";

export async function seedDirector() {
  console.log("Seeding director account...");

  const password = await bcrypt.hash("Director@123", 10);

  const superAdminRole = await prisma.role.findUnique({
    where: {
      name: "SUPER_ADMIN",
    },
  });

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found. Seed roles first.");
  }

  const user = await prisma.user.upsert({
    where: {
      email: "director@medanfoafcommsch.com",
    },

    update: {},

    create: {
      email: "director@medanfoafcommsch.com",

      password,

      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,

        roleId: superAdminRole.id,
      },
    },

    update: {},

    create: {
      userId: user.id,

      roleId: superAdminRole.id,
    },
  });

  await prisma.director.upsert({
    where: {
      userId: user.id,
    },

    update: {},

    create: {
      firstName: "Dhikange",

      lastName: "Jessy",

      phone: "+256701185352",

      userId: user.id,
    },
  });

  console.log("Director account created.");
}
