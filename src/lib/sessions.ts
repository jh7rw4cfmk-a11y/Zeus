import { prisma } from "@/lib/prisma";

function withAvailability<T extends { capacity: number; bookings: { numTickets: number }[] }>(
  session: T
) {
  const booked = session.bookings.reduce((sum, b) => sum + b.numTickets, 0);
  return { ...session, spotsLeft: Math.max(session.capacity - booked, 0) };
}

export async function getUpcomingSessions() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const sessions = await prisma.iceSession.findMany({
    where: { startTime: { gte: startOfToday } },
    orderBy: { startTime: "asc" },
    include: { bookings: { where: { status: "CONFIRMED" } } },
  });

  return sessions.map(withAvailability);
}

export async function getSessionWithAvailability(id: string) {
  const session = await prisma.iceSession.findUnique({
    where: { id },
    include: { bookings: { where: { status: "CONFIRMED" } } },
  });

  return session ? withAvailability(session) : null;
}
