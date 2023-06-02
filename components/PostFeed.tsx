import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Post, PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import PostDropdownMenu from './PostDropdownMenu';
import PostModal from './PostModal';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';

type PostFeedProps = {
  posts: (Post & {
    user: {
      name: string | null;
      image: string | null;
    };
  })[];
};

const prisma = new PrismaClient();

function CreatePostModalTrigger() {
  return (
    <Button
      variant="ghost"
      className="justify-start flex-grow rounded-full text-muted-foreground bg-muted"
    >
      What&apos;s on your mind?
    </Button>
  );
}

export default async function PostFeed({ posts }: PostFeedProps) {
  const session = await getServerSession(authOptions);

  const createPost = async (data: FormData) => {
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
      redirect('/');
    }
  };

  return (
    <>
      <div className="flex h-10 gap-2 px-2 mx-auto sm:px-0 sm:max-w-prose">
        {session?.user.image && (
          <Image
            className="w-10 rounded-full"
            src={session.user.image}
            width={32}
            height={32}
            alt="user avatar"
          />
        )}
        <PostModal
          actionLabel="Create"
          mutateFn={createPost}
          ModalTrigger={CreatePostModalTrigger}
        />
      </div>
      <ul className="flex flex-col items-center gap-4 mx-2 my-4 sm:gap-8">
        {posts.map((post) => (
          <li key={post.id} className="w-full sm:max-w-prose">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {post.user.image && (
                      <Image
                        className="w-8 rounded-full"
                        src={post.user.image}
                        width={32}
                        height={32}
                        alt="user avatar"
                      />
                    )}
                    <p className="text-sm font-semibold">{post.user.name}</p>
                  </div>
                  {session?.user.id === post.userId && (
                    // @ts-expect-error Server Component
                    <PostDropdownMenu
                      postId={post.id}
                      initialContent={post.content}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{post.content}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
