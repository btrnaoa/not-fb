import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

const prisma = new PrismaClient();

export default async function NewPost() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }

  const newPost = async (data: FormData) => {
    'use server';

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
      redirect('/posts');
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex w-full h-10 gap-2 px-2 mx-auto sm:px-0 sm:max-w-prose">
        {session.user.image && (
          <Image
            className="w-10 rounded-full"
            src={session.user.image}
            width={32}
            height={32}
            alt="user avatar"
          />
        )}
        <span className="flex items-center flex-grow h-full px-4 text-gray-400 rounded-full bg-gray-50">
          What&apos;s on your mind?
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create post</DialogTitle>
        </DialogHeader>
        <form action={newPost}>
          <div className="flex flex-col gap-4">
            <Textarea name="content" placeholder="What's on your mind?" />
            <Button type="submit">Post</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
