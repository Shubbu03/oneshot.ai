"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import Link from "next/link";
import LikeButton from "@/components/like-button";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="relative group"
    >
      <motion.div
        className="absolute -inset-0.5 rounded-lg z-0 opacity-0 group-hover:opacity-70 blur-[1px]"
        style={{
          background:
            "linear-gradient(45deg, #6366f1, #8b5cf6, #d946ef, #6366f1)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <Card className="h-full flex flex-col hover:shadow-md transition-shadow relative z-10 bg-card">
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

            <div className="min-h-[4.5rem]">
              {project.description ? (
                <p className="text-muted-foreground line-clamp-3 mb-2">
                  {project.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic mb-2">
                  No description provided
                </p>
              )}
            </div>
          </Link>
        </CardContent>

        <CardFooter className="pt-0 pb-6 px-6">
          <div className="text-sm text-muted-foreground">
            by {project.developed_by}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
