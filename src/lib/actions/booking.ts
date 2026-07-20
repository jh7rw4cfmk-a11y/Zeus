"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createBooking(
  sessionId: string,
  locale: string,
  formData: FormData
) {
  const authSession = await auth();
  if (!authSession?.user) {
    redirect(`/${locale}/login`);
  }

  const iceSession = await prisma.iceSession.findUnique({
    where: { id: sessionId },
    include: { bookings: { where: { status: "CONFIRMED" } } },
  });
  if (!iceSession) {
    redirect(`/${locale}/schedule`);
  }

  const booked = iceSession.bookings.reduce((sum, b) => sum + b.numTickets, 0);
  const spotsLeft = iceSession.capacity - booked;

  const requested = Number(formData.get("tickets"));
  const numTickets = Number.isFinite(requested)
    ? Math.min(Math.max(1, Math.trunc(requested)), Math.max(spotsLeft, 0))
    : 1;

  if (numTickets < 1 || numTickets > spotsLeft) {
    redirect(`/${locale}/book/${sessionId}?error=full`);
  }

  const totalSar = iceSession.priceSar * numTickets;

  const booking = await prisma.booking.create({
    data: {
      userId: authSession.user.id,
      sessionId,
      numTickets,
      totalSar,
      payment: {
        create: { amountSar: totalSar, status: "MOCK_PAID" },
      },
    },
  });

  redirect(`/${locale}/book/${sessionId}/success?bookingId=${booking.id}`);
}

export async function cancelBooking(bookingId: string, locale: string) {
  const authSession = await auth();
  if (!authSession?.user) {
    redirect(`/${locale}/login`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (booking && booking.userId === authSession.user.id) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  }

  redirect(`/${locale}/account`);
}
