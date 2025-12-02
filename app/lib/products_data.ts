import prisma from '@/app/lib/prisma';

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredProducts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await prisma.product.findMany({
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

    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsPages(query: string) {
  try {
    const data = await prisma.product.count({
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
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsById(id: string) {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return null;
  }
  try {
    const data = await prisma.product.findUnique({
      where: {
        id: numericId,
      }
    });
    if (!data) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}

export async function fetchBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return brands;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch brands.');
  }
}

export async function fetchProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}