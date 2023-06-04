import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Post } from '@prisma/client';
import { IconThumbUpFilled } from '@tabler/icons-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import LikeButton from './LikeButton';
import PostDropdownMenu from './PostDropdownMenu';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';

type HeaderProps = {
  postId: string;
  initialContent: string;
  userName: string | null;
  userImage: string | null;
  renderDropdownMenu: boolean;
};

type ContentProps = {
  postId: string;
  content: string;
  likeCount: number;
  liked: boolean;
};

type PostCardProps = {
  post: Post & {
    likes: {
      userId: string;
    }[];
    user: {
      name: string | null;
      image: string | null;
    };
  };
};

function Header({
  postId,
  initialContent,
  userName,
  userImage,
  renderDropdownMenu,
}: HeaderProps) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        {userImage && (
          <Image
            className="w-8 rounded-full"
            src={userImage}
            width={32}
            height={32}
            alt="user avatar"
          />
        )}
        {userName && <p className="text-sm font-semibold">{userName}</p>}
      </div>
      {renderDropdownMenu && (
        // @ts-expect-error Server Component
        <PostDropdownMenu postId={postId} initialContent={initialContent} />
      )}
    </div>
  );
}

function Content({ postId, content, likeCount, liked }: ContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm whitespace-pre-line">{content}</p>
      {likeCount > 0 && (
        <div className="flex">
          <div className="flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400">
            <IconThumbUpFilled className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-sm text-muted-foreground">{likeCount}</div>
        </div>
      )}
      <Separator />
      <div className="grid grid-flow-col justify-stretch">
        <LikeButton postId={postId} liked={liked} />
      </div>
    </div>
  );
}

export default async function PostCard({ post }: PostCardProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const liked = userId
    ? post.likes.map((like) => like.userId).includes(userId)
    : false;

  return (
    <Card>
      <CardHeader>
        <Header
          postId={post.id}
          initialContent={post.content}
          userName={post.user.name}
          userImage={post.user.image}
          renderDropdownMenu={post.userId === userId}
        />
      </CardHeader>
      <CardContent>
        <Content
          postId={post.id}
          content={post.content}
          likeCount={post.likes.length}
          liked={liked}
        />
      </CardContent>
    </Card>
  );
}
