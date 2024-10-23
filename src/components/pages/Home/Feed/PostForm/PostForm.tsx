"use client";
import { useRouter } from "next/navigation";
import { Avatar, Button, Chip, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { HalloweenBg } from "./HalloweenBg";
import { showNotification } from "components/Notifications";
import { newPostAPI } from "services/posts";
import { useUserContext } from "hooks/useUserContext";
import { VideoScreamer } from "./VideoScreamer";

type MediaX = "image" | "video";

export function PostForm() {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("halloween-bg");
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState("");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const router = useRouter();
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isModalOpen]);

  const handleSetMedia = (media: string[]) => setMedia(media);

  const handleSubmitPost = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const postObject = {
        description: description,
        media: media,
        type_media: (mode === "halloween-bg" ? "image" : "video") as MediaX,
      };
      const data = await newPostAPI(postObject);
      router.push(`/posts/${data.id}`);
      showNotification({
        title: "Success",
        message: "Post created successfully",
        color: "green",
      });
      setLoading(false);
      setDescription("");
      setMedia([]);
      closeModal();
    } catch (error) {
      setLoading(false);
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full rounded-lg p-4 flex items-center space-x-4 border-b border-gray-300 dark:border-[var(--mantine-color-dark-4)]">
        <Avatar src={user?.profile.avatar} />
        <input
          type="text"
          className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none"
          placeholder="Create and post something amazing."
          onClick={openModal}
          readOnly
        />
        <Button radius={"lg"} onClick={openModal}>
          Publish
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white dark:bg-[var(--mantine-color-dark-7)] min-h-[auto] h-[auto] max-h-[90vh] rounded-lg w-full overflow-auto max-w-[600px] border border-gray-300 dark:border-[var(--mantine-color-dark-4)]">
            <div className="p-4 border-b border-gray-300 dark:border-[var(--mantine-color-dark-4)]">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">New Post</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex space-x-4 items-center">
                <Avatar src={user?.profile.avatar} />
                <div className="flex gap-2 flex-wrap">
                  <Chip.Group
                    multiple={false}
                    value={mode}
                    onChange={(value) => {
                      handleSetMedia([]);
                      setDescription("");
                      setMedia([]);
                      setMode(value);
                    }}
                  >
                    <Chip value="halloween-bg">Halloween Background</Chip>
                    <Chip value="video-screamer">Video Screamer</Chip>
                    <Chip value="random-filters">Random Filters</Chip>
                  </Chip.Group>
                </div>
              </div>
              {mode === "halloween-bg" && (
                <>
                  <HalloweenBg handleSetMedia={handleSetMedia} />
                </>
              )}
              {mode === "video-screamer" && (
                <>
                  <VideoScreamer handleSetMedia={handleSetMedia} />
                </>
              )}
              {mode === "random-filters" && (
                <>
                  <div className="mt-2">
                    <p>In building</p>
                  </div>
                </>
              )}
            </div>
            {media.length > 0 && (
              <div className="p-4 border-t border-gray-300 dark:border-[var(--mantine-color-dark-4)]">
                <TextInput
                  label="Content"
                  placeholder="Add something amazing."
                  value={description}
                  onChange={(event) =>
                    setDescription(event.currentTarget.value)
                  }
                />
              </div>
            )}
            <div className="p-4 border-t border-gray-300 dark:border-[var(--mantine-color-dark-4)] flex justify-end">
              <Button
                radius={"lg"}
                disabled={media.length === 0}
                onClick={handleSubmitPost}
                loading={loading}
              >
                Publish Magic
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
