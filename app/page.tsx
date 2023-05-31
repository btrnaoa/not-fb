import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1>{session ? 'Welcome!' : 'Hello, World!'}</h1>
    </main>
  );
}
