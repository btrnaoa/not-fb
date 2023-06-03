'use client';

import { likePost } from '@/actions';
import clsx from 'clsx';
import { ThumbsUp } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from './ui/button';

type LikeButtonProps = {
  postId: string;
  liked: boolean;
};

export default function LikeButton({ postId, liked }: LikeButtonProps) {
  let [isPending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => startTransition(() => likePost(postId))}
    >
      <ThumbsUp
        className={clsx('w-4 h-4 mr-2', {
          'fill-current text-indigo-600': liked,
        })}
      />
      <span className={clsx({ 'font-bold text-indigo-600': liked })}>Like</span>
    </Button>
  );
}
