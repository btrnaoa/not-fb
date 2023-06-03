import { editPost } from '@/actions';
import { MoreVertical } from 'lucide-react';
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

export default async function PostDropdownMenu({
  postId,
  initialContent,
}: PostDropdownMenuProps) {
  return (
    <PostModal
      actionLabel="Edit"
      content={initialContent}
      mutateFn={async (formData) => {
        'use server';
        return editPost(formData, postId);
      }}
    >
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
