'use client';

import { likePost } from '@/actions';
import clsx from 'clsx';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import PostCardButton from './PostCardButton';
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
          <PostCardButton
            icon={<ThumbsUp />}
            isHighlighted={liked}
            handleClick={() => likePost(postId)}
          >
            <span className={clsx({ 'font-bold text-indigo-600': liked })}>
              Like
            </span>
          </PostCardButton>
          <PostCardButton icon={<MessageSquare />} handleClick={handleClick}>
            Comment
          </PostCardButton>
        </div>
      </div>
      {isExpanded && children}
    </>
  );
}
