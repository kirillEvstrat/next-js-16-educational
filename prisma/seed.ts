import { auth } from "@/lib/auth";
import { membersData } from "./membersData";
import { prisma } from "@/lib/prisma";

async function seedUsers() {
  for (const members of membersData) {
    const results = await auth.api.signUpEmail({
      body: {
        email: members.email,
        password: "Kirill1998",
        name: members.name,
        image: members.image,
      },
    });

    const userId = results.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        member: {
          create: {
            dateOfBirth: new Date(members.dateOfBirth),
            gender: members.gender,
            name: members.name,
            created: new Date(members.created),
            updated: new Date(members.lastActive),
            description: members.description,
            city: members.city,
            country: members.country,
            image: members.image,
            photos: {
              create: [{ url: members.image }],
            },
          },
        },
      },
    });
  }
}

async function main() {
  await seedUsers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
