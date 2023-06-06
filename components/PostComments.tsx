import { deleteComment, editComment, getComments } from '@/actions';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import DropdownMenu from './DropdownMenu';
import PostCardButton from './PostCardButton';
import TextInputModal from './TextInputModal';
import { DropdownMenuItem } from './ui/dropdown-menu';

type PostCommentsProps = {
  postId: string;
};

export default async function PostComments({ postId }: PostCommentsProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const comments = await getComments(postId);

  return (
    <ul className="flex flex-col gap-4 mt-6 ml-6">
      {comments.map((comment) => (
        <li key={comment.id}>
          <div className="flex justify-between">
            <div>
              <div className="flex gap-2">
                {comment.user.image && (
                  <Image
                    src={comment.user.image}
                    width={24}
                    height={24}
                    alt="comment user avatar"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-sm font-bold whitespace-nowrap">
                  {comment.user.name}
                </span>
              </div>
              <p className="mx-8 text-sm text-muted-foreground">
                {comment.content}
              </p>
            </div>
            {(comment.user.id === userId || comment.post.userId === userId) && (
              <TextInputModal
                title="Edit comment"
                initialContent={comment.content}
                contentPlaceholder="What's on your mind?"
                buttonLabel="Post"
                mutateFn={async (formData) => {
                  'use server';
                  return editComment(formData, comment.id);
                }}
              >
                <DropdownMenu
                  dropdownMenuItemModalTrigger={
                    <DropdownMenuItem>
                      <PostCardButton>Edit</PostCardButton>
                    </DropdownMenuItem>
                  }
                >
                  <DropdownMenuItem>
                    <PostCardButton
                      className="text-destructive"
                      handleClick={async () => {
                        'use server';
                        return deleteComment(comment.id);
                      }}
                    >
                      Delete
                    </PostCardButton>
                  </DropdownMenuItem>
                </DropdownMenu>
              </TextInputModal>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
