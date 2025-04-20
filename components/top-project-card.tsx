"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import Link from "next/link";
import LikeButton from "@/components/like-button";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TopProjectCardProps {
  project: Project;
}

export default function TopProjectCard({ project }: TopProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  useState(() => {
    const likedProjects = JSON.parse(
      localStorage.getItem("likedProjects") || "[]"
    );
    setIsLiked(likedProjects.includes(project.id));
  });

  const handleLikeEffect = (newLikeStatus: boolean) => {
    setIsLiked(newLikeStatus);
  };

  return (
    <Card className="overflow-hidden border-2 border-yellow-500">
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary" className="mb-3 text-lg px-3 py-1">
            {project.ai_used}
          </Badge>

          <LikeButton
            projectId={project.id}
            initialLikes={project.likes || 0}
            size="default"
            onLikeChange={handleLikeEffect}
            className="scale-110"
          />
        </div>

        <Link href={`/projects/${project.id}`} className="block group">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {project.name}
          </h3>

          {project.description && (
            <p className="text-muted-foreground mb-4">{project.description}</p>
          )}
        </Link>

        <div className="flex flex-wrap gap-3 mt-4">
          <Button size="sm" asChild>
            <Link
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>

          {project.github_link && (
            <Button size="sm" variant="outline" asChild>
              <Link
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                Source Code
              </Link>
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-4">
        <div className="text-sm font-medium">by {project.developed_by}</div>

        {isLiked && (
          <div className="ml-auto">
            <span className="text-yellow-500 font-bold">★ You liked this!</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
