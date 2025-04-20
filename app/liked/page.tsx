"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Project } from "@/types/project";

export default function LikedProjectsPage() {
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLikedProjects() {
      try {
        const likedProjectIds = JSON.parse(
          localStorage.getItem("likedProjects") || "[]"
        );

        if (likedProjectIds.length === 0) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .in("id", likedProjectIds)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setLikedProjects(data || []);
      } catch (error) {
        console.error("Error fetching liked projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLikedProjects();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-xl">
          Loading your liked projects...
        </div>
      </div>
    );
  }

  if (likedProjects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">No Liked Projects Yet</h1>
        <p className="text-xl text-muted-foreground mb-8">
          You haven&apos;t liked any projects yet. Explore the feed and like
          projects to see them here!
        </p>
        <Button asChild size="lg">
          <Link href="/">Explore Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-center mb-8">
        <Heart className="h-8 w-8 text-red-500 mr-3 fill-red-500" />
        <h1 className="text-3xl font-bold">Your Liked Projects</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedProjects.map((project, index) => (
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

      <div className="mt-10 text-center">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to all projects</Link>
        </Button>
      </div>
    </div>
  );
}
