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
import DropdownMenuItemButton from './DropdownMenu/DropdownMenuItemButton';
import PostCardToggle from './PostCardToggle';
import PostComments from './PostComments';
import TextInputModal from './TextInputModal';
import UserTextInputModal from './UserTextInputModal';
import { Card, CardContent, CardHeader } from './ui/card';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { Separator } from './ui/separator';

dayjs.extend(relativeTime);

type HeaderProps = {
  postId: string;
  postCreatedAt: Date;
  initialContent: string;
  userName: string | null;
  userImage: string | null;
  renderDropdownMenu: boolean;
};

type ContentProps = {
  postId: string;
  content: string;
  likes: { userId: string }[];
  renderComments: boolean;
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
            className="w-8 rounded-full"
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
              <DropdownMenuItem>
                <DropdownMenuItemButton>Edit</DropdownMenuItemButton>
              </DropdownMenuItem>
            }
          >
            <DropdownMenuItem>
              <DropdownMenuItemButton
                className="text-destructive"
                handleClick={async () => {
                  'use server';
                  return deletePost(postId);
                }}
              >
                Delete
              </DropdownMenuItemButton>
            </DropdownMenuItem>
          </DropdownMenu>
        </TextInputModal>
      )}
    </div>
  );
}

async function Content({
  postId,
  content,
  likes,
  renderComments,
}: ContentProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const liked = userId
    ? likes.map((like) => like.userId).includes(userId)
    : false;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm whitespace-pre-line">{content}</p>
      {likes.length > 0 && (
        <div className="flex">
          <div className="flex items-center justify-center w-5 h-5 mr-1.5 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400">
            <IconThumbUpFilled className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-sm text-muted-foreground">{likes.length}</div>
        </div>
      )}
      <Separator />
      <PostCardToggle postId={postId} liked={liked}>
        {session?.user.image && (
          <UserTextInputModal
            userImage={session.user.image}
            title="Add comment"
            placeholder="What's on your mind?"
            buttonLabel="Post"
            mutateFn={async (data) => {
              'use server';
              return addComment(data, postId);
            }}
          />
        )}
        {/* @ts-expect-error Server Component */}
        {renderComments && <PostComments postId={postId} />}
      </PostCardToggle>
    </div>
  );
}

export default async function PostCard({ post }: PostCardProps) {
  const session = await getServerSession(authOptions);
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
        {/* @ts-expect-error Server Component */}
        <Content
          postId={post.id}
          content={post.content}
          likes={post.likes}
          renderComments={post._count.comments > 0}
        />
      </CardContent>
    </Card>
  );
}
