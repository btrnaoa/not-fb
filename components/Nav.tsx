'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export default function Nav() {
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    return (
      <div className="flex justify-end mx-2 my-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            {session.user.image && (
              <Image
                className="rounded-full w-9 h-9"
                src={session.user.image}
                width={36}
                height={36}
                alt="user profile"
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2 text-muted-foreground" />
              <button type="button" onClick={() => signOut()}>
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  return (
    <button type="button" onClick={() => signIn()}>
      Log in
    </button>
  );
}
