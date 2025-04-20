"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import Link from "next/link";
import LikeButton from "@/components/like-button";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="flex-grow p-6">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-3">
            {project.ai_used}
          </Badge>
          <LikeButton
            projectId={project.id}
            initialLikes={project.likes || 0}
            size="sm"
          />
        </div>

        <Link href={`/projects/${project.id}`} className="block group">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.name}
          </h3>

          {project.description && (
            <p className="text-muted-foreground line-clamp-3 mb-2">
              {project.description}
            </p>
          )}
        </Link>
      </CardContent>

      <CardFooter className="pt-0 pb-6 px-6">
        <div className="text-sm text-muted-foreground">
          by {project.developed_by}
        </div>
      </CardFooter>
    </Card>
  );
}
