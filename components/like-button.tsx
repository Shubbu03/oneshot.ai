"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  projectId: string;
  initialLikes: number;
  size?: "default" | "sm";
  className?: string;
  onLikeChange?: (isLiked: boolean) => void;
}

export default function LikeButton({
  projectId,
  initialLikes,
  size = "default",
  className,
  onLikeChange,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const likedProjects = JSON.parse(
      localStorage.getItem("likedProjects") || "[]"
    );
    const liked = likedProjects.includes(projectId);
    setIsLiked(liked);

    if (onLikeChange) {
      onLikeChange(liked);
    }
  }, [projectId, onLikeChange]);

  const handleLike = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const newLikeStatus = !isLiked;
      const likedProjects = JSON.parse(
        localStorage.getItem("likedProjects") || "[]"
      );

      if (newLikeStatus) {
        if (!likedProjects.includes(projectId)) {
          likedProjects.push(projectId);
          localStorage.setItem("likedProjects", JSON.stringify(likedProjects));
        }

        const { error } = await supabase.rpc("increment_likes", {
          project_id: projectId,
        });
        if (error) throw error;

        setLikes((prev) => prev + 1);
      } else {
        const updatedLikedProjects = likedProjects.filter(
          (id: string) => id !== projectId
        );
        localStorage.setItem(
          "likedProjects",
          JSON.stringify(updatedLikedProjects)
        );

        const { error } = await supabase.rpc("decrement_likes", {
          project_id: projectId,
        });
        if (error) throw error;

        setLikes((prev) => Math.max(0, prev - 1));
      }

      setIsLiked(newLikeStatus);

      if (onLikeChange) {
        onLikeChange(newLikeStatus);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleLike}
      disabled={isUpdating}
      className={cn("flex items-center gap-1 cursor-pointer", className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
      <span>{likes}</span>
    </Button>
  );
}
