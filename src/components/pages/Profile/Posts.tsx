"use client";

import { useEffect, useState } from "react";

import { Post } from "components/Post";
import { PostData } from "interfaces/posts";
import { getUserPostsAPI } from "services/accounts";

interface PostsProps {
  posts: PostData[];
}

export function Posts({ posts }: PostsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [newPosts, setNewPosts] = useState<PostData[]>([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGetUserPosts = async () => {
    try {
      const data = await getUserPostsAPI(posts[0].user.username!);
      setNewPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (posts[0]?.user.username!) {
      handleGetUserPosts();
    }
  }, [posts]);
  return (
    <>
      {isLoaded && (
        <>
          {newPosts.length > 0 ? (
            <>
              {newPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </>
          ) : (
            <>
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </>
          )}
          {newPosts.length === 0 && (
            <div className="w-full h-full flex justify-center items-center p-10">
              <p>They haven't posted anything yet.</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
