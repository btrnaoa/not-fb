'use client';

import { useState } from 'react';
import CommentButton from './CommentButton';
import LikeButton from './LikeButton';

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
        <LikeButton postId={postId} liked={liked} />
        <CommentButton handleOnClick={() => setShowComments((prev) => !prev)} />
      </div>
      {showComments && children}
    </>
  );
}
