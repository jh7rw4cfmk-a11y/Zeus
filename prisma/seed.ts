import bcrypt from "bcryptjs";
import { PrismaClient, SessionType } from "@prisma/client";

const prisma = new PrismaClient();

function atTime(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@coolarena.sa" },
    update: {},
    create: {
      name: "CoolArena Admin",
      email: "admin@coolarena.sa",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+966112345678",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@coolarena.sa" },
    update: {},
    create: {
      name: "Sara Al-Otaibi",
      email: "customer@coolarena.sa",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "+966501234567",
    },
  });

  const plans = await Promise.all(
    [
      {
        nameEn: "Bronze",
        nameAr: "برونزي",
        priceSar: 199,
        monthlyCredits: 4,
        perksEn: "4 public skate sessions per month",
        perksAr: "٤ جلسات تزلج عام شهريًا",
      },
      {
        nameEn: "Silver",
        nameAr: "فضي",
        priceSar: 349,
        monthlyCredits: 8,
        perksEn: "8 sessions per month + 10% off lessons",
        perksAr: "٨ جلسات شهريًا + خصم ١٠٪ على الدروس",
      },
      {
        nameEn: "Gold",
        nameAr: "ذهبي",
        priceSar: 599,
        monthlyCredits: 16,
        perksEn: "16 sessions per month + free skate rental",
        perksAr: "١٦ جلسة شهريًا + استئجار زلاجات مجانًا",
      },
    ].map((plan) =>
      prisma.membershipPlan.upsert({
        where: { id: plan.nameEn.toLowerCase() },
        update: {},
        create: { id: plan.nameEn.toLowerCase(), ...plan },
      })
    )
  );

  await prisma.membership.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      planId: plans[0].id,
      creditsRemaining: 3,
      renewalDate: atTime(14, 0),
    },
  });

  // Clear existing sessions so seeding is idempotent for demo data.
  await prisma.iceSession.deleteMany({});

  const sessionsData: {
    titleEn: string;
    titleAr: string;
    type: SessionType;
    startTime: Date;
    endTime: Date;
    capacity: number;
    priceSar: number;
  }[] = [];

  for (let day = 0; day < 14; day++) {
    const weekday = atTime(day, 0).getDay(); // 0=Sun..6=Sat

    // Public skate, three sessions daily.
    for (const [hour, label] of [
      [10, "Morning"],
      [16, "Afternoon"],
      [20, "Evening"],
    ] as const) {
      sessionsData.push({
        titleEn: `Public Skate — ${label}`,
        titleAr: `تزلج عام — ${label === "Morning" ? "صباحًا" : label === "Afternoon" ? "عصرًا" : "مساءً"}`,
        type: "PUBLIC_SKATE",
        startTime: atTime(day, hour),
        endTime: atTime(day, hour + 2),
        capacity: 40,
        priceSar: 60,
      });
    }

    // Hockey: Sunday, Tuesday, Thursday (0, 2, 4)
    if ([0, 2, 4].includes(weekday)) {
      sessionsData.push({
        titleEn: "Hockey Practice",
        titleAr: "تدريب الهوكي",
        type: "HOCKEY",
        startTime: atTime(day, 21),
        endTime: atTime(day, 22, 30),
        capacity: 20,
        priceSar: 90,
      });
    }

    // Figure skating lesson: Monday, Wednesday (1, 3)
    if ([1, 3].includes(weekday)) {
      sessionsData.push({
        titleEn: "Figure Skating Lesson",
        titleAr: "درس تزلج فني",
        type: "LESSON",
        startTime: atTime(day, 17),
        endTime: atTime(day, 18),
        capacity: 10,
        priceSar: 150,
      });
    }

    // Private rental: Friday, Saturday (5, 6)
    if ([5, 6].includes(weekday)) {
      sessionsData.push({
        titleEn: "Private Rink Rental",
        titleAr: "حجز خاص للحلبة",
        type: "RENTAL",
        startTime: atTime(day, 22),
        endTime: atTime(day, 23),
        capacity: 30,
        priceSar: 800,
      });
    }
  }

  await prisma.iceSession.createMany({ data: sessionsData });

  const firstPublicSkate = await prisma.iceSession.findFirst({
    where: { type: "PUBLIC_SKATE" },
    orderBy: { startTime: "asc" },
  });

  if (firstPublicSkate) {
    const existingBooking = await prisma.booking.findFirst({
      where: { userId: customer.id, sessionId: firstPublicSkate.id },
    });
    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          userId: customer.id,
          sessionId: firstPublicSkate.id,
          numTickets: 2,
          totalSar: firstPublicSkate.priceSar * 2,
          payment: {
            create: {
              amountSar: firstPublicSkate.priceSar * 2,
              status: "MOCK_PAID",
            },
          },
        },
      });
    }
  }

  console.log("Seeded:");
  console.log(`  Admin login:    ${admin.email} / Admin123!`);
  console.log(`  Customer login: ${customer.email} / Customer123!`);
  console.log(`  ${sessionsData.length} sessions created for the next 14 days.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
