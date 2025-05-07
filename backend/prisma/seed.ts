import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário master
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const masterUser = await prisma.usuario.upsert({
    where: { email: 'dsr.proj3ct@gmail.com' },
    update: {},
    create: {
      nome: 'Danilo Roque',
      email: 'dsr.proj3ct@gmail.com',
      senha: hashedPassword,
    },
  });

  console.log('Usuário master criado:', masterUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 