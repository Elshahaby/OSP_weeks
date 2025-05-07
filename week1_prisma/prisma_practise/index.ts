import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // await prisma.profile.deleteMany();
    // await prisma.user.deleteMany();

  const user = await prisma.user.update({
    where:{
        email: "k1@gmail.com"         
    },
    data:{
        profile:{
            create:{
                emailUpdates: true
            }
        }
    },
    include:{
        profile: true
    }
  });

  console.log(user);
}

main().catch(error => {
    console.error(error.message)
})
.finally(async () => prisma.$disconnect());


