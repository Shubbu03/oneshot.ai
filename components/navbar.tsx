"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, Trophy, Heart } from "lucide-react";
import { useState } from "react";
import AddProjectModal from "@/components/add-project-modal";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          oneshot.ai
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size={isMobile ? "icon" : "sm"} asChild>
            <Link href="/liked" aria-label="Liked Projects">
              <Heart className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Liked</span>}
            </Link>
          </Button>

          <Button variant="ghost" size={isMobile ? "icon" : "sm"} asChild>
            <Link href="/leaderboard" aria-label="Leaderboard">
              <Trophy className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Leaderboard</span>}
            </Link>
          </Button>

          <Button
            onClick={() => setIsModalOpen(true)}
            size={isMobile ? "icon" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Add Project</span>}
          </Button>

          <ThemeToggle />
        </div>
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}
