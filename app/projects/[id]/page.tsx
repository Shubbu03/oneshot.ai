import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import LikeButton from "@/components/like-button";

export const revalidate = 300;

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", (await params).id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{project.ai_used}</Badge>
                <span className="text-muted-foreground">
                  by {project.developed_by}
                </span>
              </div>
            </div>
            <LikeButton
              projectId={project.id}
              initialLikes={project.likes || 0}
              className="mt-1"
            />
          </div>

          {project.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">About this project</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Project
              </Link>
            </Button>

            {project.github_link && (
              <Button variant="outline" asChild>
                <Link
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View Source Code
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/">← Back to projects</Link>
        </Button>
      </div>
    </div>
  );
}
