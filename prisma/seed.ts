import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users and products...');

  const hashedPassword = await bcrypt.hash('test1234', 10);

  // --- USERS ---
  const users = [
    { email: 'zirkanew82@gmail.com', role: 'ADMIN' },
    { email: 'podolyak365@gmail.com', role: 'ADMIN' },
    { email: 'glebkirsenko@gmail.com', role: 'ADMIN' },
    { email: 'kobzar.anatolii.vl@gmail.com', role: 'ADMIN' },
    { email: 'team@huntressdigital.com', role: 'ADMIN' },
    { email: 'provider1@example.com', role: 'PROVIDER' },
    { email: 'provider2@example.com', role: 'PROVIDER' },
    { email: 'provider3@example.com', role: 'PROVIDER' },
    { email: 'patient1@example.com', role: 'PATIENT' },
    { email: 'patient2@example.com', role: 'PATIENT' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: hashedPassword,
        role: u.role as any,
      },
    });
    console.log(`User ${u.email} created or exists`);
  }

  // --- PRODUCTS ---
  const products = [
    {
      name: 'Organic Shampoo',
      brand: 'NatureCare',
      price: 25.5,
      discountPrice: 20.0,
      imageUrl: '/images/product1.jpg',
      description: 'Gentle shampoo for all hair types',
      quantities: [
        { label: '100ml', value: 15 },
        { label: '200ml', value: 10 },
      ],
    },
    {
      name: 'Herbal Conditioner',
      brand: 'NatureCare',
      price: 22.0,
      discountPrice: 18.0,
      imageUrl: '/images/product2.jpg',
      description: 'Softens and nourishes hair',
      quantities: [
        { label: '150ml', value: 20 },
        { label: '300ml', value: 12 },
      ],
    },
    {
      name: 'Face Wash',
      brand: 'GlowSkin',
      price: 15.0,
      discountPrice: 12.0,
      imageUrl: '/images/product3.jpg',
      description: 'Removes impurities and refreshes skin',
      quantities: [
        { label: '100ml', value: 25 },
        { label: '200ml', value: 18 },
      ],
    },
    {
      name: 'Moisturizing Cream',
      brand: 'GlowSkin',
      price: 30.0,
      discountPrice: 25.0,
      imageUrl: '/images/product4.jpg',
      description: 'Hydrates and softens skin',
      quantities: [
        { label: '50ml', value: 20 },
        { label: '100ml', value: 15 },
      ],
    },
    {
      name: 'Vitamin C Serum',
      brand: 'DermaPlus',
      price: 40.0,
      discountPrice: 35.0,
      imageUrl: '/images/product5.jpg',
      description: 'Brightens and revitalizes skin',
      quantities: [
        { label: '30ml', value: 10 },
        { label: '50ml', value: 8 },
      ],
    },
    {
      name: 'Anti-Aging Cream',
      brand: 'DermaPlus',
      price: 50.0,
      discountPrice: 45.0,
      imageUrl: '/images/product6.jpg',
      description: 'Reduces wrinkles and fine lines',
      quantities: [
        { label: '50ml', value: 12 },
        { label: '100ml', value: 7 },
      ],
    },
    {
      name: 'Body Lotion',
      brand: 'SilkySkin',
      price: 18.0,
      discountPrice: 15.0,
      imageUrl: '/images/product7.jpg',
      description: 'Smooth and soft skin all day',
      quantities: [
        { label: '200ml', value: 30 },
        { label: '400ml', value: 20 },
      ],
    },
    {
      name: 'Sunscreen SPF50',
      brand: 'SilkySkin',
      price: 20.0,
      discountPrice: 16.0,
      imageUrl: '/images/product8.jpg',
      description: 'Protects skin from harmful UV rays',
      quantities: [
        { label: '100ml', value: 25 },
        { label: '200ml', value: 15 },
      ],
    },
    {
      name: 'Lip Balm',
      brand: 'SoftLips',
      price: 5.0,
      discountPrice: 4.0,
      imageUrl: '/images/product9.jpg',
      description: 'Moisturizes and protects lips',
      quantities: [
        { label: '10g', value: 50 },
        { label: '20g', value: 30 },
      ],
    },
  ];

  for (const p of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        brand: p.brand,
        price: new Prisma.Decimal(p.price),
        discountPrice: p.discountPrice
          ? new Prisma.Decimal(p.discountPrice)
          : null,
        imageUrl: p.imageUrl,
        description: p.description,
        quantities: {
          create: p.quantities.map((q) => ({ label: q.label, value: q.value })),
        },
      },
    });
    console.log(`Product ${createdProduct.name} created`);
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding finished.');
  });

// npx node prisma/seed.ts
