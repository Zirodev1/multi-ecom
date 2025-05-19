import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create demo categories
  const categories = [
    { name: 'Electronics', image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', url: 'electronics', featured: true },
    { name: 'Fashion', image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', url: 'fashion', featured: true },
    { name: 'Home & Garden', image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', url: 'home-garden', featured: false },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category
    });
  }

  // Create demo subcategories
  const subcategories = [
    { name: 'Smartphones', image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', url: 'smartphones', featured: true, categoryId: '' },
    { name: 'Laptops', image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', url: 'laptops', featured: true, categoryId: '' },
    { name: "Men's Clothing", image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', url: 'mens-clothing', featured: true, categoryId: '' },
  ];

  const electronicsCategory = await prisma.category.findFirst({
    where: { url: 'electronics' }
  });

  const fashionCategory = await prisma.category.findFirst({
    where: { url: 'fashion' }
  });

  if (electronicsCategory && fashionCategory) {
    await prisma.subCategory.createMany({
      data: [
        { ...subcategories[0], categoryId: electronicsCategory.id },
        { ...subcategories[1], categoryId: electronicsCategory.id },
        { ...subcategories[2], categoryId: fashionCategory.id },
      ]
    });
  }

  // Create demo store
  const demoStore = await prisma.store.create({
    data: {
      name: 'Demo Electronics Store',
      description: 'This is a demo store for testing purposes',
      email: 'demo@store.com',
      phone: '+1234567890',
      url: 'demo-electronics',
      logo: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      cover: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      status: 'ACTIVE',
      featured: true,
      userId: 'demo-user', // You'll need to update this with a real user ID after creating a user through Clerk
    }
  });

  // Create demo products
  const smartphone = await prisma.product.create({
    data: {
      name: 'Demo Smartphone',
      description: 'This is a demo smartphone for testing purposes',
      slug: 'demo-smartphone',
      brand: 'Demo Brand',
      storeId: demoStore.id,
      categoryId: electronicsCategory!.id,
      subCategoryId: (await prisma.subCategory.findFirst({ where: { url: 'smartphones' } }))!.id,
      variants: {
        create: {
          variantName: 'Demo Variant',
          variantDescription: 'Demo variant description',
          variantImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
          slug: 'demo-smartphone-variant',
          sku: 'DEMO-SKU-001',
          keywords: 'demo, smartphone, test',
          weight: 0.5,
          sizes: {
            create: {
              size: '128GB',
              quantity: 100,
              price: 999.99,
              discount: 10,
            }
          },
          colors: {
            create: {
              name: 'Black'
            }
          },
          images: {
            create: {
              url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
              alt: 'Demo Smartphone Image'
            }
          }
        }
      }
    }
  });

  // Create demo shipping rates
  await prisma.country.create({
    data: {
      name: 'United States',
      code: 'US',
      shippingRates: {
        create: {
          shippingService: 'Standard Shipping',
          shippingFeePerItem: 5.99,
          shippingFeeForAdditionalItem: 2.99,
          shippingFeePerKg: 1.99,
          shippingFeeFixed: 0,
          deliveryTimeMin: 3,
          deliveryTimeMax: 7,
          returnPolicy: '30 days return policy',
          storeId: demoStore.id
        }
      }
    }
  });

  console.log('Demo data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 