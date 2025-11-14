import { formatCurrency } from './utils';
import prisma from '@/app/lib/prisma';

export async function fetchRevenue() {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
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

export async function fetchTotalOrder() {
  try {
    const data = await prisma.order.count();
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total order data');
  }
}

export async function fetchTotalCustomers() {
  try {
    const data = await prisma.user.count({
      where: {role: 0},
    });
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total customers data');
  }
}

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredOrders(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { user: { name: { contains: query } } },
          { user: { email: { contains: query } } },
          {
            total: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            createdAt: {
              equals: new Date(query).toString() === 'Invalid Date' ? undefined : new Date(query),
            },
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return orders;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchOrdersPages(query: string) {
  try {
    const data = await prisma.order.count({
      where: {
        OR: [
          { user: { name: { contains: query } } },
          { user: { email: { contains: query } } },
          {
            total: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
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
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchCustomers() {
  try{
    const data = await prisma.user.findMany({
      where: { role: 0},
      select: {
        name: true,
        id: true,
      },
      orderBy: { name: 'asc' }
    });
    return data.map((customer) => ({
      id: customer.id,
      name: customer.name,
    }));
  } catch (error){
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchOrdersById(id: string) {
  try {
    const data = await prisma.order.findUnique({
      where: {
        id: Number(id),
      }
    });
    if (!data) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}

export async function fetchFilteredCategories(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const categories = await prisma.category.findMany({
      where: {
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

    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchCategoriesPages(query: string) {
  try {
    const data = await prisma.category.count({
      where: {
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
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchCategoriesById(id: string) {
  try {
    const data = await prisma.category.findUnique({
      where: {
        id: Number(id),
      }
    });
    if (!data) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchFilteredBrands(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const brands = await prisma.brand.findMany({
      where: {
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

    return brands;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchBrandsPages(query: string) {
  try {
    const data = await prisma.brand.count({
      where: {
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
    throw new Error('Failed to fetch brands.');
  }
}

export async function fetchBrandsById(id: string) {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return null;
  }
  try {
    const data = await prisma.brand.findUnique({
      where: {
        id: numericId,
      }
    });
    if (!data) {
      throw new Error(`Brand with ID ${id} not found`);
    }
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch brands.');
  }
}
