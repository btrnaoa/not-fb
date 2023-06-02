import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { MoreVertical } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DeletePostButton from './DeletePostButton';
import PostModal from './PostModal';
import { Button } from './ui/button';
import { DialogTrigger } from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type PostDropdownMenuProps = {
  postId: string;
  initialContent: string;
};

const prisma = new PrismaClient();

export default async function PostDropdownMenu({
  postId,
  initialContent,
}: PostDropdownMenuProps) {
  const session = await getServerSession(authOptions);

  const editPost = async (data: FormData) => {
    'use server';

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
  };

  return (
    <PostModal actionLabel="Edit" content={initialContent} mutateFn={editPost}>
      <DropdownMenu>
        <DropdownMenuTrigger className="self-start">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start w-full"
              >
                Edit
              </Button>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>
            <DeletePostButton postId={postId} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PostModal>
  );
}
