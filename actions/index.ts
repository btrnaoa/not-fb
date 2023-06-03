'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession as originalGetServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';

const prisma = new PrismaClient();

// FIXME https://github.com/nextauthjs/next-auth/issues/7486#issuecomment-1543747325
const getServerSession = async () => {
  const req = {
    headers: Object.fromEntries(headers() as Headers),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value]),
    ),
  };
  const res = { getHeader() {}, setCookie() {}, setHeader() {} };

  // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
  const session = await originalGetServerSession(req, res, authOptions);
  return session;
};

export async function deletePost(postId: string) {
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath('/');
}

export async function likePost(postId: string) {
  const session = await getServerSession();

  const userId = session?.user.id;
  if (userId) {
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    if (like) {
      await prisma.like.delete({ where: { id: like.id } });
    } else {
      await prisma.like.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }
    revalidatePath('/');
  }
}
