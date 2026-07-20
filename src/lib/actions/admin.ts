"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SessionType } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin(locale: string) {
  const authSession = await auth();
  if (!authSession?.user || authSession.user.role !== "ADMIN") {
    redirect(`/${locale}`);
  }
  return authSession;
}

function sessionDataFromForm(formData: FormData) {
  return {
    titleEn: String(formData.get("titleEn") ?? ""),
    titleAr: String(formData.get("titleAr") ?? ""),
    type: String(formData.get("type") ?? "PUBLIC_SKATE") as SessionType,
    startTime: new Date(String(formData.get("startTime"))),
    endTime: new Date(String(formData.get("endTime"))),
    capacity: Math.max(1, Number(formData.get("capacity")) || 1),
    priceAdultSar: Math.max(0, Number(formData.get("priceAdultSar")) || 0),
    priceKidSar: Math.max(0, Number(formData.get("priceKidSar")) || 0),
    womenOnly: formData.get("womenOnly") === "on",
    kidsAllowed: formData.get("kidsAllowed") === "on",
  };
}

export async function createSession(locale: string, formData: FormData) {
  await requireAdmin(locale);
  await prisma.iceSession.create({ data: sessionDataFromForm(formData) });
  revalidatePath(`/${locale}/admin/sessions`);
  redirect(`/${locale}/admin/sessions`);
}

export async function updateSession(
  sessionId: string,
  locale: string,
  formData: FormData
) {
  await requireAdmin(locale);
  await prisma.iceSession.update({
    where: { id: sessionId },
    data: sessionDataFromForm(formData),
  });
  revalidatePath(`/${locale}/admin/sessions`);
  redirect(`/${locale}/admin/sessions`);
}

export async function deleteSession(sessionId: string, locale: string) {
  await requireAdmin(locale);
  await prisma.iceSession.delete({ where: { id: sessionId } });
  revalidatePath(`/${locale}/admin/sessions`);
  redirect(`/${locale}/admin/sessions`);
}

export async function cancelBookingAdmin(bookingId: string, locale: string) {
  await requireAdmin(locale);
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
  revalidatePath(`/${locale}/admin/bookings`);
  redirect(`/${locale}/admin/bookings`);
}

export async function createMembershipPlan(locale: string, formData: FormData) {
  await requireAdmin(locale);
  await prisma.membershipPlan.create({
    data: {
      nameEn: String(formData.get("nameEn") ?? ""),
      nameAr: String(formData.get("nameAr") ?? ""),
      priceSar: Math.max(0, Number(formData.get("priceSar")) || 0),
      monthlyCredits: Math.max(0, Number(formData.get("monthlyCredits")) || 0),
      perksEn: String(formData.get("perksEn") ?? ""),
      perksAr: String(formData.get("perksAr") ?? ""),
    },
  });
  revalidatePath(`/${locale}/admin/members`);
  redirect(`/${locale}/admin/members`);
}
