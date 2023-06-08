import { addComment, deletePost, editPost } from '@/actions';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Post } from '@prisma/client';
import { IconThumbUpFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Clock } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import DropdownMenu from './DropdownMenu';
import DropdownMenuItem from './DropdownMenuItem';
import PostCardFooter from './PostCardFooter';
import PostComments from './PostComments';
import TextInputModal from './TextInputModal';
import UserTextInputModal from './UserTextInputModal';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { DropdownMenuItem as _DropdownMenuItem } from './ui/dropdown-menu';

dayjs.extend(relativeTime);

type HeaderProps = {
  postId: string;
  postCreatedAt: Date;
  initialContent: string;
  userName: string | null;
  userImage: string | null;
  renderDropdownMenu: boolean;
};

type PostCardProps = {
  post: Post & {
    _count: {
      comments: number;
    };
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
  postCreatedAt,
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
            className="w-8 h-8 rounded-full"
            src={userImage}
            width={32}
            height={32}
            alt="user avatar"
          />
        )}
        <div>
          {userName && <div className="text-sm font-semibold">{userName}</div>}
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <div>{dayjs(postCreatedAt).fromNow()}</div>
          </div>
        </div>
      </div>
      {renderDropdownMenu && (
        <TextInputModal
          title="Edit post"
          initialContent={initialContent}
          contentPlaceholder="What's on your mind?"
          buttonLabel="Post"
          mutateFn={async (formData) => {
            'use server';
            return editPost(formData, postId);
          }}
        >
          <DropdownMenu
            dropdownMenuItemModalTrigger={
              <_DropdownMenuItem>Edit</_DropdownMenuItem>
            }
          >
            <DropdownMenuItem
              handleClick={async () => {
                'use server';
                return deletePost(postId);
              }}
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenu>
        </TextInputModal>
      )}
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
          postCreatedAt={post.createdAt}
          initialContent={post.content}
          userName={post.user.name}
          userImage={post.user.image}
          renderDropdownMenu={post.userId === session?.user.id}
        />
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line">{post.content}</p>
      </CardContent>
      <CardFooter>
        <div className="grid w-full grid-cols-2">
          <div className="flex items-center h-10">
            {post.likes.length > 0 && (
              <>
                <div className="flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400">
                  <IconThumbUpFilled className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {post.likes.length}
                </div>
              </>
            )}
          </div>
          <PostCardFooter
            postId={post.id}
            liked={liked}
            commentCount={post._count.comments}
          >
            <div className="flex flex-col w-full col-span-2 mt-4">
              {/* @ts-expect-error Server Component */}
              <UserTextInputModal
                title="Add comment"
                placeholder="What's on your mind?"
                buttonLabel="Post"
                mutateFn={async (formData) => {
                  'use server';
                  return addComment(formData, post.id);
                }}
              />
              {/* @ts-expect-error Server Component */}
              {post._count.comments > 0 && <PostComments postId={post.id} />}
            </div>
          </PostCardFooter>
        </div>
      </CardFooter>
    </Card>
  );
}
