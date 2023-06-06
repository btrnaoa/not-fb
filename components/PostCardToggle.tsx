'use client';

import { likePost } from '@/actions';
import clsx from 'clsx';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import PostCardButton from './PostCardButton';

type PostCardToggle = {
  postId: string;
  liked: boolean;
  children: React.ReactNode;
};

export default function PostCardToggle({
  postId,
  liked,
  children,
}: PostCardToggle) {
  const [showComments, setShowComments] = useState(false);
  return (
    <>
      <div className="grid grid-flow-col justify-stretch">
        <PostCardButton
          icon={<ThumbsUp />}
          isHighlighted={liked}
          handleClick={() => likePost(postId)}
        >
          <span className={clsx({ 'font-bold text-indigo-600': liked })}>
            Like
          </span>
        </PostCardButton>
        <PostCardButton
          icon={<MessageSquare />}
          handleClick={() => setShowComments((prev) => !prev)}
        >
          Comment
        </PostCardButton>
      </div>
      {showComments && children}
    </>
  );
}
