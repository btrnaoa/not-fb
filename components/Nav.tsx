'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Nav() {
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    return (
      <div>
        {session.user && (
          <div className="flex items-center gap-2">
            {session.user.image && (
              <Image
                className="rounded-full w-9 h-9"
                src={session.user.image}
                width={36}
                height={36}
                alt="user profile"
              />
            )}
            <p className="text-sm font-bold">{session.user.name}</p>
          </div>
        )}
        <button type="button" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button type="button" onClick={() => signIn()}>
      Sign in
    </button>
  );
}
