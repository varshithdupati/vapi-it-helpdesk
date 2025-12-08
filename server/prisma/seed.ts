import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.ticket.deleteMany();
  await prisma.device.deleteMany();
  await prisma.employee.deleteMany();

  // Create Employee 12345 - Alex Johnson, Engineering
  const alex = await prisma.employee.create({
    data: {
      id: '12345',
      name: 'Alex Johnson',
      department: 'Engineering',
      devices: {
        create: [
          {
            type: 'laptop',
            assetTag: 'L-9812',
            os: 'macOS 15',
          },
          {
            type: 'phone',
            assetTag: 'P-4421',
            os: 'iOS 18',
          },
        ],
      },
    },
    include: { devices: true },
  });

  console.log(`Created employee: ${alex.name} (${alex.id}) with ${alex.devices.length} devices`);

  // Create Employee 67890 - Priya Patel, Sales
  const priya = await prisma.employee.create({
    data: {
      id: '67890',
      name: 'Priya Patel',
      department: 'Sales',
      devices: {
        create: [
          {
            type: 'laptop',
            assetTag: 'L-7741',
            os: 'Windows 11',
          },
        ],
      },
    },
    include: { devices: true },
  });

  console.log(`Created employee: ${priya.name} (${priya.id}) with ${priya.devices.length} device(s)`);

  // Create a sample ticket for demonstration
  const sampleTicket = await prisma.ticket.create({
    data: {
      ticketNumber: 'IT-1',
      employeeId: '12345',
      deviceAssetTag: 'L-9812',
      issueSummary: 'Sample issue: Laptop running slowly after recent update.',
      status: 'OPEN',
    },
  });

  console.log(`Created sample ticket: ${sampleTicket.ticketNumber}`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

