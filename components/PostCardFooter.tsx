'use client';

import { likePost } from '@/actions';
import clsx from 'clsx';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type PostCardFooterProps = {
  postId: string;
  liked: boolean;
  commentCount: number;
  children: React.ReactNode;
};

export default function PostCardFooter({
  postId,
  liked,
  commentCount,
  children,
}: PostCardFooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [_, startTransition] = useTransition();

  const handleClick = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {commentCount > 0 && (
        <Button
          variant="link"
          onClick={handleClick}
          className="text-xs justify-self-end text-muted-foreground"
        >
          {`${commentCount} comment${commentCount - 1 ? 's' : ''}`}
        </Button>
      )}
      <div className="col-span-2">
        <Separator />
        <div className="grid grid-flow-col mt-4 justify-stretch">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => startTransition(() => likePost(postId))}
          >
            <ThumbsUp
              className={clsx('w-4 h-4 mr-2', {
                'text-indigo-600 fill-current': liked,
              })}
            />
            <span className={clsx({ 'font-bold text-indigo-600': liked })}>
              Like
            </span>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClick}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Comment
          </Button>
        </div>
      </div>
      {isExpanded && children}
    </>
  );
}
