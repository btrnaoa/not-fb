'use client';

import clsx from 'clsx';
import { useTransition } from 'react';
import { Button } from '../ui/button';

type DropdownMenuItemButtonProps = {
  handleClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

export default function DropdownMenuItemButton({
  handleClick,
  className,
  children,
}: DropdownMenuItemButtonProps) {
  let [_, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick && (() => startTransition(handleClick))}
      className={clsx('justify-start w-full', className)}
    >
      {children}
    </Button>
  );
}
