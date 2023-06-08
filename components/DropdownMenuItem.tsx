'use client';

import { useTransition } from 'react';
import { DropdownMenuItem as _DropdownMenuItem } from './ui/dropdown-menu';

type DropdownMenuItemProps = {
  handleClick: () => void;
  className: string;
  children: React.ReactNode;
};

export default function DropdownMenuItem({
  handleClick,
  className,
  children,
}: DropdownMenuItemProps) {
  const [_, startTransition] = useTransition();
  return (
    <_DropdownMenuItem
      onClick={() => startTransition(handleClick)}
      className={className}
    >
      {children}
    </_DropdownMenuItem>
  );
}
