// prisma/seed.ts

import { PrismaClient, StatusBooking } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Dados estáticos para o usuário admin e seu negócio
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "@Password123"; // Senha para teste, NUNCA use em produção!

/**
 * Função principal para popular o banco de dados.
 */
async function main() {
  console.log("Iniciando o processo de seeding...");

  // 1. GARANTIR A EXISTÊNCIA DO USUÁRIO ADMIN
  const passwordHash = await hash(ADMIN_PASSWORD, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
    },
    create: {
      name: "Admin Profissional",
      email: ADMIN_EMAIL,
      emailVerified: new Date(),
      passwordHash,
    },
  });

  console.log(`Usuário admin criado/atualizado: ${adminUser.email}`);

  // 2. CRIAR O NEGÓCIO VINCULADO AO ADMIN
  const businessSlug = "salao-do-admin";

  const adminBusiness = await prisma.business.upsert({
    where: { slug: businessSlug },
    update: {
      name: "Salão do Profissional Admin",
      ownerId: adminUser.id,
    },
    create: {
      name: "Salão do Profissional Admin",
      slug: businessSlug,
      owner: {
        connect: { id: adminUser.id },
      },
    },
  });

  console.log(
    `Negócio criado/atualizado: ${adminBusiness.name} (ID: ${adminBusiness.id})`,
  );

  // 3. CRIAR SERVIÇOS
  const servicesData = [
    { name: "Corte de Cabelo Masculino", durationInMinutes: 45, price: 5000 }, // R$ 50,00 (em centavos)
    { name: "Barba Tradicional", durationInMinutes: 30, price: 3500 }, // R$ 35,00
    { name: "Combo Cabelo e Barba", durationInMinutes: 75, price: 8000 }, // R$ 80,00
  ];

  for (const data of servicesData) {
    await prisma.service.upsert({
      where: {
        // Simplesmente garante a inserção, você pode precisar de um identificador único melhor.
        // Usando o nome para upsert neste exemplo.
        id: `${adminBusiness.id}-${data.name.replace(/\s/g, "-").toLowerCase()}`,
      },
      update: { ...data },
      create: {
        ...data,
        businessId: adminBusiness.id,
      },
    });
  }
  console.log(`Criados ${servicesData.length} serviços.`);

  // 4. CRIAR CLIENTES
  const customer1 = await prisma.customer.upsert({
    where: {
      email_businessId: {
        email: "cliente1@mail.com",
        businessId: adminBusiness.id,
      },
    },
    update: {},
    create: {
      name: "João Cliente",
      email: "cliente1@mail.com",
      phone: "11987654321",
      businessId: adminBusiness.id,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: {
      email_businessId: {
        email: "cliente2@mail.com",
        businessId: adminBusiness.id,
      },
    },
    update: {},
    create: {
      name: "Maria Cliente",
      email: "cliente2@mail.com",
      phone: "11999998888",
      businessId: adminBusiness.id,
    },
  });
  console.log("Criados 2 clientes.");

  // 5. CRIAR HORÁRIOS DE FUNCIONAMENTO (Segunda a Sexta, das 9h às 18h)
  const workingHoursData = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    dayOfWeek,
    startTime: "09:00",
    endTime: "18:00",
    businessId: adminBusiness.id,
  }));

  for (const whData of workingHoursData) {
    await prisma.workingHours.upsert({
      where: {
        businessId_dayOfWeek: {
          businessId: adminBusiness.id,
          dayOfWeek: whData.dayOfWeek,
        },
      },
      update: whData,
      create: whData,
    });
  }
  console.log("Criados horários de funcionamento (Seg-Sex).");

  // 6. CRIAR AGENDAMENTOS (Bookings)
  const corteService = await prisma.service.findFirst({
    where: { name: "Corte de Cabelo Masculino", businessId: adminBusiness.id },
  });

  if (corteService) {
    const today = new Date();
    today.setHours(10, 0, 0, 0); // Exemplo: Agendamento para hoje às 10:00

    await prisma.booking.createMany({
      data: [
        {
          startTime: today,
          endTime: new Date(
            today.getTime() + corteService.durationInMinutes * 60000,
          ),
          status: StatusBooking.CONFIRMED,
          businessId: adminBusiness.id,
          customerId: customer1.id,
          serviceId: corteService.id,
        },
        {
          startTime: new Date(today.getTime() + 60 * 60000), // 1 hora depois
          endTime: new Date(
            today.getTime() +
              60 * 60000 +
              corteService.durationInMinutes * 60000,
          ),
          status: StatusBooking.PENDING,
          businessId: adminBusiness.id,
          customerId: customer2.id,
          serviceId: corteService.id,
        },
      ],
    });
    console.log("Criados 2 agendamentos de exemplo.");
  }

  // 7. CRIAR PRODUTOS (Estoque)
  await prisma.product.createMany({
    data: [
      { name: "Pomada Modeladora", quantity: 50, businessId: adminBusiness.id },
      {
        name: "Shampoo Profissional",
        quantity: 25,
        businessId: adminBusiness.id,
      },
    ],
  });
  console.log("Criados 2 produtos de estoque.");

  console.log("Processo de seeding concluído com sucesso! 🎉");
  console.log("----------------------------------------------------");
  console.log(`Credenciais de acesso para teste:`);
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Senha: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
