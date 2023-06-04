'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

type CommentButtonProps = {
  handleOnClick: () => void;
};

export default function CommentButton({ handleOnClick }: CommentButtonProps) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleOnClick}>
      <MessageSquare className="w-4 h-4 mr-2" />
      Comment
    </Button>
  );
}
