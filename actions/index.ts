'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function deletePost(postId: string) {
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath('/');
}
