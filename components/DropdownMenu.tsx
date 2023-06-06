import { MoreVertical } from 'lucide-react';
import { DialogTrigger } from './ui/dialog';
import {
  DropdownMenu as _DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type DropdownMenuProps = {
  dropdownMenuItemModalTrigger: React.ReactElement;
  children: React.ReactNode;
};

export default function DropdownMenu({
  dropdownMenuItemModalTrigger,
  children,
}: DropdownMenuProps) {
  return (
    <_DropdownMenu>
      <DropdownMenuTrigger className="self-start">
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DialogTrigger asChild>{dropdownMenuItemModalTrigger}</DialogTrigger>
        {children}
      </DropdownMenuContent>
    </_DropdownMenu>
  );
}
