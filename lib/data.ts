import { db } from "@/lib/db";

export async function getDashboardData() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [members, payments, visitsToday, recentPayments] = await Promise.all([
      db.member.findMany({ orderBy: { createdAt: "desc" } }),
      db.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: startOfMonth } } }),
      db.visit.count({ where: { checkedIn: { gte: startOfDay } } }),
      db.payment.findMany({ take: 5, orderBy: { paidAt: "desc" }, include: { member: true } }),
    ]);
    return { members, income: Number(payments._sum.amount ?? 0), visitsToday, recentPayments, connected: true };
  } catch {
    return { members: [], income: 0, visitsToday: 0, recentPayments: [], connected: false };
  }
}

export async function getMembers() {
  try { return await db.member.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }); }
  catch { return []; }
}

export async function getMember(id: string) {
  return db.member.findUnique({ where: { id } });
}

export async function getPayments() {
  try {
    return await db.payment.findMany({ orderBy: { paidAt: "desc" }, include: { member: true } });
  } catch {
    return [];
  }
}

export async function getPayment(id: string) {
  return db.payment.findUnique({ where: { id }, include: { member: true } });
}
