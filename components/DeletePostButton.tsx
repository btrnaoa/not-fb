'use client';

import { deletePost } from '@/actions';
import { useTransition } from 'react';
import { Button } from './ui/button';

type DeletePostButtonProps = {
  postId: string;
};

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  let [isPending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="justify-start w-full text-destructive"
      onClick={() => startTransition(() => deletePost(postId))}
    >
      Delete
    </Button>
  );
}
