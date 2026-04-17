import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Upsert services
  const services = [
    {
      name: 'Premium Body Wash',
      slug: 'premium-body-wash',
      category: 'wash',
      description:
        'A thorough exterior wash using premium pH-neutral shampoos, wheel cleaning, tyre dressing, and a streak-free hand-dry finish.',
      duration: '60-90 mins',
      priceType: 'fixed',
      basePrice: 29900,
    },
    {
      name: 'Interior Deep Cleaning',
      slug: 'interior-deep-cleaning',
      category: 'detailing',
      description:
        'Complete interior vacuum, steam cleaning of upholstery and carpets, dashboard conditioning, and glass polishing inside.',
      duration: '3-4 hours',
      priceType: 'fixed',
      basePrice: 79900,
    },
    {
      name: 'Paint Protection Film (PPF)',
      slug: 'ppf',
      category: 'protection',
      description:
        'Self-healing polyurethane film applied to high-impact zones for long-lasting paint protection against chips, scratches, and UV.',
      duration: '1-2 days',
      priceType: 'quote',
      basePrice: null,
    },
    {
      name: 'Rubbing & Polish',
      slug: 'rubbing-polish',
      category: 'detailing',
      description:
        'Machine compound polishing to remove swirl marks, light scratches, and oxidation, restoring your paint to a mirror-like gloss.',
      duration: '4-6 hours',
      priceType: 'quote',
      basePrice: null,
    },
    {
      name: 'Underbody Coating',
      slug: 'underbody-coating',
      category: 'protection',
      description:
        'Rubberised anti-corrosion coating applied to the underbody, wheel arches, and floor pan to protect against rust and road noise.',
      duration: '2-3 hours',
      priceType: 'quote',
      basePrice: null,
    },
    {
      name: '10H Graphene Coating',
      slug: '10h-graphene-coating',
      category: 'coating',
      description:
        'Top-tier graphene-infused ceramic coating offering hardness up to 10H, extreme hydrophobics, heat dissipation, and 5+ year protection.',
      duration: '2 days',
      priceType: 'quote',
      basePrice: null,
    },
    {
      name: '9H Graphene Coating',
      slug: '9h-graphene-coating',
      category: 'coating',
      description:
        'Professional-grade graphene ceramic coating with 9H hardness, deep gloss enhancement, and 3-5 year durability.',
      duration: '1-2 days',
      priceType: 'quote',
      basePrice: null,
    },
    {
      name: '9H Pro Ceramic Coating',
      slug: '9h-pro-ceramic-coating',
      category: 'coating',
      description:
        'Industry-standard 9H ceramic coating providing a hard glass shield, hydrophobic surface, UV protection, and up to 3 years of coverage.',
      duration: '1-2 days',
      priceType: 'quote',
      basePrice: null,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`Seeded ${services.length} services.`);

  // Upsert wash pricing
  const washPricingData = [
    // basic
    { package: 'basic', vehicleType: 'small', priceInPaise: 29900 },
    { package: 'basic', vehicleType: 'sedan', priceInPaise: 29900 },
    { package: 'basic', vehicleType: 'muv', priceInPaise: 29900 },
    { package: 'basic', vehicleType: 'luxury', priceInPaise: 29900 },
    // standard
    { package: 'standard', vehicleType: 'small', priceInPaise: 39900 },
    { package: 'standard', vehicleType: 'sedan', priceInPaise: 44900 },
    { package: 'standard', vehicleType: 'muv', priceInPaise: 49900 },
    { package: 'standard', vehicleType: 'luxury', priceInPaise: 59900 },
    // premium
    { package: 'premium', vehicleType: 'small', priceInPaise: 59900 },
    { package: 'premium', vehicleType: 'sedan', priceInPaise: 64900 },
    { package: 'premium', vehicleType: 'muv', priceInPaise: 69900 },
    { package: 'premium', vehicleType: 'luxury', priceInPaise: 79900 },
    // ultimate
    { package: 'ultimate', vehicleType: 'small', priceInPaise: 79900 },
    { package: 'ultimate', vehicleType: 'sedan', priceInPaise: 84900 },
    { package: 'ultimate', vehicleType: 'muv', priceInPaise: 89900 },
    { package: 'ultimate', vehicleType: 'luxury', priceInPaise: 99900 },
  ];

  // Delete existing and re-insert for idempotency
  await prisma.washPricing.deleteMany({});
  await prisma.washPricing.createMany({ data: washPricingData });
  console.log(`Seeded ${washPricingData.length} wash pricing rows.`);

  // Admin user
  const hashedPassword = await bcrypt.hash('DetailX@2026', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@detailx.in' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@detailx.in',
      password: hashedPassword,
    },
  });
  console.log('Seeded admin user: admin@detailx.in');

  console.log('Database seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
