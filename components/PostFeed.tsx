import { createPost } from '@/actions';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Post } from '@prisma/client';
import { IconThumbUpFilled } from '@tabler/icons-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import LikeButton from './LikeButton';
import PostDropdownMenu from './PostDropdownMenu';
import PostModal from './PostModal';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';

type PostFeedProps = {
  posts: (Post & {
    likes: {
      userId: string | null;
    }[];
    user: {
      name: string | null;
      image: string | null;
    };
  })[];
};

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
  const userId = session?.user.id;
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
        {posts.map((post) => {
          const liked = userId
            ? post.likes.map((like) => like.userId).includes(userId)
            : false;
          return (
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
                    {userId === post.userId && (
                      // @ts-expect-error Server Component
                      <PostDropdownMenu
                        postId={post.id}
                        initialContent={post.content}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <p className="text-sm whitespace-pre-line">
                      {post.content}
                    </p>
                    {post.likes.length > 0 && (
                      <div className="flex">
                        <div className="flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400">
                          <IconThumbUpFilled className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {post.likes.length}
                        </div>
                      </div>
                    )}
                    <Separator />
                    <div className="grid grid-flow-col justify-stretch">
                      <LikeButton postId={post.id} liked={liked} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
