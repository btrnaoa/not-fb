'use client';

import { Loader2, LogOut } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Nav() {
  const { data: session, status } = useSession();
  return (
    <div className="flex justify-end mx-2 my-4">
      {status === 'authenticated' ? (
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
              <button onClick={() => signOut()}>Log out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : status === 'loading' ? (
        <Button disabled>
          <Loader2 className="w-4 h-4 animate-spin" />
        </Button>
      ) : (
        <Button type="button" onClick={() => signIn()}>
          Log in
        </Button>
      )}
    </div>
  );
}
