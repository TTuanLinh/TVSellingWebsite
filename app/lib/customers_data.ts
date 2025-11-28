import prisma from '@/app/lib/prisma';

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredCustomers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const customers = await prisma.user.findMany({
      where: {
        role: 0, // Chỉ lấy khách hàng (role 0)
        OR: [
          { name: { contains: query } },
          {
            createdAt: {
              equals: new Date(query).toString() === 'Invalid Date' ? undefined : new Date(query),
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return customers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchSumOrdersById(id: string) {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return null;
  }
  try {
    const data = await prisma.order.count({
      where: {
        userId: numericId,
      },
    });
    return data || 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sum of orders.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const data = await prisma.user.count({
      where: {
        role: 0, // Chỉ đếm khách hàng (role 0)
        OR: [
          { name: { contains: query } },
          {
            createdAt: {
              equals: new Date(query).toString() === 'Invalid Date' ? undefined : new Date(query),
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(data / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchCustomersById(id: string) {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return null;
  }
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: numericId,
        role: 0, // Chỉ lấy khách hàng (role 0)
      }
    });
    if (!data) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}