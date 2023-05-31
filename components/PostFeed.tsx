import { Post } from '@prisma/client';
import Image from 'next/image';
import NewPost from './NewPost';
import { Card, CardContent, CardHeader } from './ui/card';

type PostFeedProps = {
  posts: (Post & {
    user: {
      name: string | null;
      image: string | null;
    };
  })[];
};

export default function PostFeed({ posts }: PostFeedProps) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <NewPost />
      <ul className="flex flex-col items-center gap-4 mx-2 my-4 sm:gap-8">
        {posts.map((post) => (
          <li key={post.id} className="w-full sm:max-w-prose">
            <Card>
              <CardHeader>
                <div className="flex gap-2">
                  {post.user.image && (
                    <Image
                      className="w-8 rounded-full"
                      src={post.user.image}
                      width={32}
                      height={32}
                      alt="user avatar"
                    />
                  )}
                  <p className="text-sm font-semibold">{post.user.name}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{post.content}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
