import bcrypt from "bcryptjs";
import { PrismaClient, SessionType } from "@prisma/client";

const prisma = new PrismaClient();

// Real CoolArena hours: closed Mondays, open 5:00 PM – 1:00 AM every other
// day. Wednesdays are reserved for women all day. Kids are welcome daily
// (except Wednesdays) only during the first slot, 5:00 PM – 8:00 PM.
const ADULT_PRICE_SAR = 80;
const KID_PRICE_SAR = 60;

function atTime(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

type SessionSeed = {
  titleEn: string;
  titleAr: string;
  type: SessionType;
  startTime: Date;
  endTime: Date;
  capacity: number;
  priceAdultSar: number;
  priceKidSar: number;
  womenOnly: boolean;
  kidsAllowed: boolean;
};

function buildDaySessions(daysFromNow: number): SessionSeed[] {
  const weekday = atTime(daysFromNow, 0).getDay(); // 0 = Sunday ... 6 = Saturday
  if (weekday === 1) return []; // Closed Mondays

  const isWednesday = weekday === 3;
  const sessions: SessionSeed[] = [];

  const base = {
    priceAdultSar: ADULT_PRICE_SAR,
    priceKidSar: KID_PRICE_SAR,
  };

  // Slot A: 5:00 PM – 8:00 PM (kids welcome, except Wednesdays)
  const slotAStart = atTime(daysFromNow, 17, 0);
  sessions.push({
    ...base,
    titleEn: isWednesday ? "Women's Skate Session" : "Public Skate — Family Hours",
    titleAr: isWednesday ? "جلسة تزلج للنساء" : "تزلج عام — أوقات العائلة",
    type: "PUBLIC_SKATE",
    startTime: slotAStart,
    endTime: addMinutes(slotAStart, 180),
    capacity: 40,
    womenOnly: isWednesday,
    kidsAllowed: !isWednesday,
  });

  // Slot B: 8:00 PM – 10:30 PM (adults only)
  const slotBStart = atTime(daysFromNow, 20, 0);
  if (isWednesday) {
    sessions.push({
      ...base,
      titleEn: "Women's Skate Session",
      titleAr: "جلسة تزلج للنساء",
      type: "PUBLIC_SKATE",
      startTime: slotBStart,
      endTime: addMinutes(slotBStart, 150),
      capacity: 40,
      womenOnly: true,
      kidsAllowed: false,
    });
  } else if (weekday === 0 || weekday === 4) {
    // Sunday & Thursday
    sessions.push({
      ...base,
      titleEn: "Hockey Practice",
      titleAr: "تدريب الهوكي",
      type: "HOCKEY",
      startTime: slotBStart,
      endTime: addMinutes(slotBStart, 150),
      capacity: 20,
      womenOnly: false,
      kidsAllowed: false,
    });
  } else if (weekday === 2) {
    // Tuesday
    sessions.push({
      ...base,
      titleEn: "Figure Skating Lesson",
      titleAr: "درس تزلج فني",
      type: "LESSON",
      startTime: slotBStart,
      endTime: addMinutes(slotBStart, 150),
      capacity: 10,
      womenOnly: false,
      kidsAllowed: false,
    });
  } else {
    sessions.push({
      ...base,
      titleEn: "Public Skate — Evening",
      titleAr: "تزلج عام — مساءً",
      type: "PUBLIC_SKATE",
      startTime: slotBStart,
      endTime: addMinutes(slotBStart, 150),
      capacity: 40,
      womenOnly: false,
      kidsAllowed: false,
    });
  }

  // Slot C: 10:30 PM – 1:00 AM (adults only)
  const slotCStart = atTime(daysFromNow, 22, 30);
  if (isWednesday) {
    sessions.push({
      ...base,
      titleEn: "Women's Skate Session",
      titleAr: "جلسة تزلج للنساء",
      type: "PUBLIC_SKATE",
      startTime: slotCStart,
      endTime: addMinutes(slotCStart, 150),
      capacity: 40,
      womenOnly: true,
      kidsAllowed: false,
    });
  } else if (weekday === 5 || weekday === 6) {
    // Friday & Saturday
    sessions.push({
      ...base,
      titleEn: "Private Rink Rental",
      titleAr: "حجز خاص للحلبة",
      type: "RENTAL",
      startTime: slotCStart,
      endTime: addMinutes(slotCStart, 150),
      capacity: 30,
      womenOnly: false,
      kidsAllowed: false,
    });
  } else {
    sessions.push({
      ...base,
      titleEn: "Public Skate — Late Night",
      titleAr: "تزلج عام — ليلاً",
      type: "PUBLIC_SKATE",
      startTime: slotCStart,
      endTime: addMinutes(slotCStart, 150),
      capacity: 40,
      womenOnly: false,
      kidsAllowed: false,
    });
  }

  return sessions;
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

  const sessionsData: SessionSeed[] = [];
  for (let day = 0; day < 14; day++) {
    sessionsData.push(...buildDaySessions(day));
  }

  await prisma.iceSession.createMany({ data: sessionsData });

  const firstFamilySession = await prisma.iceSession.findFirst({
    where: { kidsAllowed: true },
    orderBy: { startTime: "asc" },
  });

  if (firstFamilySession) {
    const existingBooking = await prisma.booking.findFirst({
      where: { userId: customer.id, sessionId: firstFamilySession.id },
    });
    if (!existingBooking) {
      const numAdults = 2;
      const numKids = 1;
      const totalSar =
        numAdults * firstFamilySession.priceAdultSar +
        numKids * firstFamilySession.priceKidSar;
      await prisma.booking.create({
        data: {
          userId: customer.id,
          sessionId: firstFamilySession.id,
          numAdults,
          numKids,
          totalSar,
          payment: {
            create: { amountSar: totalSar, status: "MOCK_PAID" },
          },
        },
      });
    }
  }

  console.log("Seeded:");
  console.log(`  Admin login:    ${admin.email} / Admin123!`);
  console.log(`  Customer login: ${customer.email} / Customer123!`);
  console.log(`  ${sessionsData.length} sessions created for the next 14 days (closed Mondays).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
