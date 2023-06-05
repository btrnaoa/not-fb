'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession as originalGetServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

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

export async function getPosts() {
  const posts = await prisma.post.findMany({
    include: {
      likes: {
        select: {
          userId: true,
        },
      },
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

export async function createPost(data: FormData) {
  const session = await getServerSession();

  const content = data.get('content')?.toString();
  if (content) {
    await prisma.post.create({
      data: {
        content,
        user: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });
    redirect('/');
  }
}

export async function editPost(data: FormData, postId: string) {
  const session = await getServerSession();

  const content = data.get('content')?.toString();
  if (content) {
    await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        posts: {
          update: {
            where: {
              id: postId,
            },
            data: {
              content,
            },
          },
        },
      },
    });
    redirect('/');
  }
}

export async function deletePost(postId: string) {
  const session = await getServerSession();

  await prisma.user.update({
    where: { id: session?.user.id },
    data: {
      posts: {
        delete: {
          id: postId,
        },
      },
    },
  });
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

export async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    select: {
      id: true,
      content: true,
      post: {
        select: {
          userId: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return comments;
}

export async function addComment(data: FormData, postId: string) {
  const session = await getServerSession();
  const userId = session?.user.id;

  const content = data.get('content')?.toString();
  if (content && userId) {
    await prisma.comment.create({
      data: {
        content,
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
    revalidatePath('/');
  }
}

export async function editComment(data: FormData, commentId: string) {
  const session = await getServerSession();

  const content = data.get('content')?.toString();
  if (content) {
    await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        comments: {
          update: {
            where: {
              id: commentId,
            },
            data: {
              content,
            },
          },
        },
      },
    });
    revalidatePath('/');
  }
}

export async function deleteComment(commentId: string) {
  const session = await getServerSession();

  await prisma.user.update({
    where: { id: session?.user.id },
    data: {
      comments: {
        delete: {
          id: commentId,
        },
      },
    },
  });
  revalidatePath('/');
}
