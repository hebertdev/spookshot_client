"use client";

import { Carousel } from "@mantine/carousel";
import { Avatar, useMantineColorScheme } from "@mantine/core";
import {
  IconMessage,
  IconSkull,
  IconSquareArrowLeft,
  IconSquareArrowRight,
  IconX,
  IconHeart,
  IconHeartFilled,
  IconVideo,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { PostData } from "interfaces/posts";
import classes from "./Post.module.css";
import { useEffect, useRef, useState } from "react";
import { addLikePostAPI, removeLikePostAPI } from "services/posts";
import Link from "next/link";
import { ShareButton } from "./ShareButton";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showNotification } from "components/Notifications";
import { useUserContext } from "hooks/useUserContext";
dayjs.extend(relativeTime);
interface PostProps {
  post: PostData;
}

export function Post({ post }: PostProps) {
  const { user } = useUserContext();
  const { colorScheme } = useMantineColorScheme();
  const [isLiked, setIsLiked] = useState(post.is_like);
  const [loading, setLoading] = useState(false);
  const [totalLikes, setTotalLikes] = useState(post?.likes?.length);
  const [totalComments, setTotalComments] = useState(post?.comments?.length);

  const handleAddLike = async () => {
    if (loading) return;
    if (!user) {
      showNotification({
        title: "Error",
        message: "Please login to like this post",
        color: "red",
      });
      return;
    }
    try {
      setLoading(true);
      await addLikePostAPI(post.id);
      setIsLiked(true);
      setTotalLikes(totalLikes + 1);
      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
      setLoading(false);
    }
  };

  const handleRemoveLike = async () => {
    if (loading) return;
    if (!user) {
      showNotification({
        title: "Error",
        message: "Please login to like this post",
        color: "red",
      });
      return;
    }
    try {
      setLoading(true);
      await removeLikePostAPI(post.id);
      setTotalLikes(totalLikes - 1);
      setIsLiked(false);
      setLoading(false);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-black dark:text-gray-100 overflow-hidden border-b border-gray-300 dark:border-[var(--mantine-color-dark-4)] ">
        <div className="p-4">
          <div className="flex items-center mb-2 gap-2">
            <Avatar
              src={post.user.profile.avatar}
              component={Link}
              href={`/@${post.user.username}`}
            />
            <div>
              <Link href={`/@${post.user.username}`}>
                <p className="font-semibold text-black dark:text-white">
                  {post.user.username}
                </p>
              </Link>
              <p className="text-xs text-gray-400">
                {dayjs(post.created).fromNow()}
              </p>
            </div>
            {/* <button></button> */}
          </div>
          <p className="mb-2">{post.description}</p>
          <ImageGallery post={post} />
          <br />
          <div className="flex items-center text-gray-400 text-sm">
            <button
              className="flex items-center mr-4 transform transition-transform duration-200 active:scale-90"
              onClick={isLiked ? handleRemoveLike : handleAddLike}
            >
              {colorScheme === "light" ? (
                <>
                  {isLiked ? (
                    <IconHeartFilled
                      size={20}
                      className="mr-1"
                      color="var(--mantine-primary-color-filled"
                    />
                  ) : (
                    <IconHeart size={20} className="mr-1" />
                  )}
                </>
              ) : (
                <>
                  {isLiked ? (
                    <IconSkull
                      size={20}
                      className="mr-1"
                      color="var(--mantine-primary-color-filled"
                    />
                  ) : (
                    <IconSkull size={20} className="mr-1" />
                  )}
                </>
              )}
              <span>{totalLikes}</span>
            </button>
            <Link href={`/posts/${post.id}`}>
              <button className="flex items-center mr-4 transform transition-transform duration-200 active:scale-90">
                <IconMessage size={20} className="mr-1" />
                <span>{totalComments}</span>
              </button>
            </Link>
            <ShareButton post={post} />
          </div>
        </div>
      </div>
    </>
  );
}

interface ImageGalleryProps {
  post: PostData;
}

export function ImageGallery({ post }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post.media.length - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < post.media.length - 1 ? prevIndex + 1 : 0
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "Escape") closeLightbox();
      }
    };

    // Agregar o quitar la clase para deshabilitar el scroll
    if (lightboxOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll"); // Asegurarse de quitar la clase al desmontar
    };
  }, [lightboxOpen]);

  return (
    <>
      <div className="relative">
        <Carousel
          withIndicators
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
        >
          {post.media.map((media, index) => (
            <Carousel.Slide
              key={media.id}
              className="min-h-[100%] max-h-[500px] overflow-hidden flex items-center justify-center w-full rounded-[20px]"
            >
              {media.media_type === "image" ? (
                <img
                  onClick={() => openLightbox(index)}
                  src={media.url_string}
                  style={{
                    height: "auto",
                    width: "auto",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    minHeight: "200px",
                    backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                    backgroundSize: "10px 10px",
                    backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                    borderRadius: "20px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <div className="relative">
                  <video
                    onClick={() => openLightbox(index)}
                    src={media.url_string}
                    style={{
                      height: "auto",
                      width: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      minHeight: "200px",
                      borderRadius: "20px",
                    }}
                  />
                  <div
                    className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <IconPlayerPlayFilled size={60} color="white" />
                  </div>
                </div>
              )}
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000]"
          // Cerrar al hacer clic en el fondo
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={closeLightbox}
          >
            <IconX size={24} />
          </button>
          {post.media.length > 1 && (
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              onClick={goToPrevious}
            >
              <IconSquareArrowLeft size={36} />
            </button>
          )}
          {post.media.length > 1 && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              onClick={goToNext}
            >
              <IconSquareArrowRight size={36} />
            </button>
          )}
          <div
            className="min-h-[95%] max-h-[95%] overflow-hidden flex items-center justify-center min-w-[95%] max-w-[95%] w-full h-full"
            onClick={closeLightbox}
            // Evitar que el clic cierre el lightbox
          >
            {post.media[currentIndex].media_type === "image" ? (
              <img
                onClick={(e) => e.stopPropagation()}
                src={post.media[currentIndex].url_string}
                className="max-w-[90%] max-h-[90%] min-h-[200px] rounded-[20px] overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
                  backgroundSize: "10px 10px",
                  backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                }}
              />
            ) : (
              <video
                onClick={(e) => e.stopPropagation()}
                ref={videoRef}
                src={post.media[currentIndex].url_string}
                controls
                autoPlay
                className="max-w-[90%] max-h-[90%] min-h-[200px] rounded-[20px] overflow-hidden"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
