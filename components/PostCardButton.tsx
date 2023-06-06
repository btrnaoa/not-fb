'use client';

import clsx from 'clsx';
import { cloneElement, useTransition } from 'react';
import { Button } from './ui/button';

type PostCardButtonProps = {
  icon?: React.ReactElement;
  isHighlighted?: boolean;
  handleClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

export default function PostCardButton({
  icon,
  isHighlighted = false,
  handleClick,
  className,
  children,
}: PostCardButtonProps) {
  let [_, startTransition] = useTransition();

  const _icon =
    icon &&
    cloneElement(icon, {
      className: clsx('w-4 h-4 mr-2', {
        'fill-current text-indigo-600': isHighlighted,
      }),
    });

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick && (() => startTransition(handleClick))}
      className={className}
    >
      {_icon}
      {children}
    </Button>
  );
}
