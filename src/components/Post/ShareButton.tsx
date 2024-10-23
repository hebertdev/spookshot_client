"use client";

import { useState, useEffect } from "react";

import { RWebShare } from "react-web-share";

//interface
import { PostData } from "interfaces/posts";
import { IconShare } from "@tabler/icons-react";

interface ShareButtonProps {
  post: PostData;
}

export function ShareButton({ post }: ShareButtonProps) {
  const [rutita, setRutita] = useState("");

  useEffect(() => {
    setRutita(window.location.origin + "/posts/" + post.id);
  }, [post]);

  return (
    <RWebShare
      data={{
        text: post.description,
        url: rutita,
        title: `Post of @${post.user.username}`,
      }}
      onClick={() => console.log("shared successfully!")}
    >
      <button className="flex items-center mr-4 transform transition-transform duration-200 active:scale-90">
        <IconShare size={20} className="mr-1" />
      </button>
    </RWebShare>
  );
}
