import { createPost } from '@/actions';
import Image from 'next/image';
import PostModal from './PostModal';
import { Button } from './ui/button';

type CreatePostProps = {
  userImage: string;
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

export default function CreatePost({ userImage }: CreatePostProps) {
  return (
    <div className="flex h-10 gap-2 px-2 mx-auto sm:px-0 sm:max-w-prose">
      <Image
        className="w-10 rounded-full"
        src={userImage}
        width={32}
        height={32}
        alt="user avatar"
      />
      <PostModal
        actionLabel="Create"
        mutateFn={createPost}
        ModalTrigger={CreatePostModalTrigger}
      />
    </div>
  );
}
