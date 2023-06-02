import PostFeed from '@/components/PostFeed';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPosts() {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  /* @ts-expect-error Server Component */
  return <PostFeed posts={posts} />;
}
