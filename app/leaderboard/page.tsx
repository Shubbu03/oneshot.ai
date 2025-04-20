import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import TopProjectCard from "@/components/top-project-card";

export const revalidate = 300;

export default async function LeaderboardPage() {
  const supabase = createClient();

  const { data: topProjects, error } = await supabase
    .from("projects")
    .select("*")
    .order("likes", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching top projects:", error);
  }

  const topProject =
    topProjects && topProjects.length > 0 ? topProjects[0] : null;
  const otherProjects =
    topProjects && topProjects.length > 1 ? topProjects.slice(1) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center mb-8">
        <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
        <h1 className="text-3xl font-bold">Top Projects Leaderboard</h1>
      </div>

      {topProject && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl text-yellow-500 mr-2">#1</span> Top
            Project
          </h2>
          <TopProjectCard project={topProject} />
        </div>
      )}

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="divide-y">
            {otherProjects && otherProjects.length > 0
              ? otherProjects.map((project, index) => (
                  <div key={project.id} className="py-4 flex items-center">
                    <div className="text-2xl font-bold w-10 text-center">
                      {index + 2}
                    </div>
                    <div className="flex-1 ml-4">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-xl font-medium hover:underline"
                      >
                        {project.name}
                      </Link>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-muted-foreground">
                          by {project.developed_by}
                        </span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {project.ai_used}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xl font-semibold">
                        {project.likes || 0} likes
                      </div>
                    </div>
                  </div>
                ))
              : !topProject && (
                  <div className="py-8 text-center text-muted-foreground">
                    No projects found. Be the first to add one!
                  </div>
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
