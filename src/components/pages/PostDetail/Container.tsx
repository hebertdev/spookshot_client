"use client";

import { Avatar, Button } from "@mantine/core";
import { showNotification } from "components/Notifications";
import { Post } from "components/Post";
import { useUserContext } from "hooks/useUserContext";
import { CommentData, PostData } from "interfaces/posts";
import { useState, useEffect, FormEvent } from "react";
import { addCommentPostAPI } from "services/posts";

interface ContainerPostProps {
  post: PostData;
}

export function ContainerPost({ post }: ContainerPostProps) {
  const { user } = useUserContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([...post.comments]);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    if (!user) {
      showNotification({
        title: "Error",
        message: "Please login to add a comment",
        color: "red",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await addCommentPostAPI(post.id, comment);
      setComments([data, ...comments]);
      setComment("");
      showNotification({
        title: "Success",
        message: "Comment added successfully",
        color: "green",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (!user) {
        showNotification({
          title: "Error",
          message: "Please login to add a comment",
          color: "red",
        });
      } else {
        showNotification({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      }
    }
  };

  return (
    <>
      {isLoaded && (
        <>
          <Post post={post} />
          <form
            onSubmit={handleAddComment}
            className="w-full   rounded-lg p-4 flex items-center space-x-4  border-b border-gray-300 dark:border-[var(--mantine-color-dark-4)]"
          >
            <Avatar src={user?.profile.avatar} />
            <input
              type="text"
              className="flex-grow bg-transparent text-black dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              placeholder="add comment"
              value={comment}
              onChange={(event) => setComment(event.currentTarget.value)}
            />
            <Button radius={"lg"} type="submit" loading={loading}>
              add comment
            </Button>
          </form>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="text-black dark:text-gray-100 w-full    rounded-lg p-4 flex items-center space-x-4  border-b border-gray-300 dark:border-[var(--mantine-color-dark-4)]"
            >
              <Avatar src={post.user?.profile.avatar} />
              <p>{comment.comment}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
