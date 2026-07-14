import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.save.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding realistic Indian creators...");

  const creators = [
    {
      name: "Rohan Fitness",
      handle: "rohanfit",
      bio: "Certified Trainer | 500k+ on YouTube. Get my workout bundles here.",
      tags: ["Fitness", "Diet", "Gym"],
      photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80",
      role: "creator"
    },
    {
      name: "Aisha Edits",
      handle: "aishaedits",
      bio: "Premiere Pro presets & tutorials. Master your editing game.",
      tags: ["Editing", "Video", "Creator"],
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      role: "creator",
      tickTier: "gold"
    },
    {
      name: "Kabir Music",
      handle: "kabirbeats",
      bio: "Indie Musician / Producer. Exclusive stems and behind-the-scenes.",
      tags: ["Music", "Producer", "Indie"],
      photo: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80",
      role: "creator"
    },
    {
      name: "Sneha Codes",
      handle: "snehacodes",
      bio: "Frontend Developer | React & Next.js courses.",
      tags: ["Coding", "Tech", "Frontend"],
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      role: "creator",
      tickTier: "blue"
    },
  ];

  const createdUsers = [];

  for (const c of creators) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        handle: c.handle,
        bio: c.bio,
        tags: c.tags,
        photo: c.photo,
        role: c.role,
        tickTier: c.tickTier || "none",
        status: "active",
      }
    });
    createdUsers.push(user);
    console.log(`Created creator: ${user.handle}`);

    // Create 3 posts per creator (2 public, 1 private)
    const postsData = [
      {
        type: "video",
        mediaKey: "demo/video1.mp4",
        caption: `Welcome to my page! Here is some free content for you. #${user.tags[0]}`,
        visibility: "public",
        price: null,
        viewCount: Math.floor(Math.random() * 5000),
      },
      {
        type: "photo",
        mediaKey: "demo/photo1.jpg",
        caption: `A glimpse into my setup today. Wait till you see the final result.`,
        visibility: "public",
        price: null,
        viewCount: Math.floor(Math.random() * 3000),
      },
      {
        type: "product",
        mediaKey: "demo/bundle.zip",
        caption: `My Ultimate ${user.tags[0]} Masterclass & Assets Bundle. Grab it now!`,
        visibility: "private",
        price: 999,
        viewCount: Math.floor(Math.random() * 1000),
      }
    ];

    for (const p of postsData) {
      await prisma.post.create({
        data: {
          creatorId: user.id,
          type: p.type,
          mediaKey: p.mediaKey,
          caption: p.caption,
          visibility: p.visibility,
          price: p.price,
          viewCount: p.viewCount,
          tags: user.tags,
          likes: {
            create: Array.from({ length: Math.floor(Math.random() * 50) }).map(() => ({
              userId: user.id // using self-likes just for seed counts
            }))
          }
        }
      });
    }
  }

  // Create a fan user and some follows
  const fan = await prisma.user.create({
    data: {
      name: "Rahul Kumar",
      handle: "rahul",
      role: "fan",
    }
  });

  for (const u of createdUsers) {
    await prisma.follow.create({
      data: {
        followerId: fan.id,
        creatorId: u.id
      }
    });
  }

  console.log("Seeding complete! Run 'npm run dev' to see the changes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
