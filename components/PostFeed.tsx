import { createPost } from '@/actions';
import { Post } from '@prisma/client';
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
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <UserTextInputModal
        title="Create post"
        placeholder="What's on your mind?"
        buttonLabel="Post"
        mutateFn={createPost}
      />
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
