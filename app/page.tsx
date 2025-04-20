import ProjectFeed from "@/components/project-feed";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

export default async function Home() {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4">OneShot.ai</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing projects built with AI. From GPT-4 to Midjourney, see
          what&apos;s possible with today&apos;s AI tools.
        </p>
      </section>

      <ProjectFeed initialProjects={projects || []} />
    </div>
  );
}
