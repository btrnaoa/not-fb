import { getPosts } from '@/actions';
import PostFeed from '@/components/PostFeed';

export default async function Home() {
  const posts = await getPosts();

  /* @ts-expect-error Server Component */
  return <PostFeed posts={posts} />;
}
