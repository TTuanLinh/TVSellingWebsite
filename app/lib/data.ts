import { formatCurrency } from './utils';
import prisma from '@/app/lib/prisma';

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLastestOrder() {
  try {
    const data = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
      take: 5,
    });
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch lastest order data');
  }
}

export async function fetchCollectedOrder() {
  try {
    const data = await prisma.order.aggregate({
      _sum: {total: true},
      where: {status: 1}
    });
    return data._sum.total ?? 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected order data');
  }
}

export async function fetchPendingOrder() {
  try {
    const data = await prisma.order.count({
      where: {status: 0},
    });
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch collected order data');
  }
}