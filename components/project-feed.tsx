"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/project-card";
import type { Project } from "@/types/project";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ProjectFeedProps {
  initialProjects: Project[];
}

export default function ProjectFeed({ initialProjects }: ProjectFeedProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const supabase = createClient();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  useEffect(() => {
    const handleProjectAdded = (event: CustomEvent<Project[]>) => {
      if (event.detail) {
        setProjects(event.detail);
      }
    };

    window.addEventListener(
      "projectAdded",
      handleProjectAdded as EventListener
    );

    return () => {
      window.removeEventListener(
        "projectAdded",
        handleProjectAdded as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProjects((prev) => [payload.new as Project, ...prev]);
            toast.info("New project added!", {
              description: `${payload.new.name} was just added to the feed.`,
            });
          } else if (payload.eventType === "UPDATE") {
            setProjects((prev) =>
              prev.map((project) =>
                project.id === payload.new.id
                  ? { ...project, ...payload.new }
                  : project
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error refreshing projects:", error);
        return;
      }

      if (data) {
        setProjects(data);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [supabase]);

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">No projects yet</h2>
        <p className="text-muted-foreground">
          Be the first to add an AI project by clicking the &quot;Add
          Project&quot; button.
        </p>
      </div>
    );
  }

  const gridCols = isMobile
    ? "grid-cols-1"
    : isTablet
    ? "grid-cols-2"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-4 sm:gap-6`}>
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
