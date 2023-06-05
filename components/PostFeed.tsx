import { createPost } from '@/actions';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Post } from '@prisma/client';
import { getServerSession } from 'next-auth';
import PostCard from './PostCard';
import UserTextInputModal from './UserTextInputModal';

type PostFeedProps = {
  posts: (Post & {
    _count: {
      comments: number;
    };
    likes: {
      userId: string;
    }[];
    user: {
      name: string | null;
      image: string | null;
    };
  })[];
};

export default async function PostFeed({ posts }: PostFeedProps) {
  const session = await getServerSession(authOptions);
  return (
    <>
      {session?.user.image && (
        <UserTextInputModal
          userImage={session.user.image}
          title="Create post"
          placeholder="What's on your mind?"
          buttonLabel="Post"
          mutateFn={createPost}
        />
      )}
      <ul className="flex flex-col items-center gap-4 mx-2 my-4 sm:gap-8">
        {posts.map((post) => {
          return (
            <li key={post.id} className="w-full sm:max-w-prose">
              {/* @ts-expect-error Server Component */}
              <PostCard post={post} />
            </li>
          );
        })}
      </ul>
    </>
  );
}
