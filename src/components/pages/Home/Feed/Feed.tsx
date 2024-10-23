"use client";

import { useEffect, useState } from "react";
import { Container, Center, Box, Title } from "@mantine/core";
import { Post } from "components/Post";
import { PostData } from "interfaces/posts";
import { getPostsAPI } from "services/posts";
import { PostForm } from "./PostForm";

export function Feed() {
  const [posts, setPosts] = useState<PostData[]>([]);

  const handleGetPosts = async () => {
    try {
      const data = await getPostsAPI();
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPosts();
  }, []);

  return (
    <>
      <Container size="xs">
        <Center mt={"xs"} mb={"xs"}>
          <Title size={"lg"}> Home </Title>
        </Center>
        <Box className="w-full rounded-[15px] bg-gray-100  dark:bg-[var(--mantine-color-dark-6)] mb-[10px] overflow-hidden">
          <PostForm />
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Box>
      </Container>
    </>
  );
}
