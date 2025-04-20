"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, Trophy } from "lucide-react";
import { useState } from "react";
import AddProjectModal from "@/components/add-project-modal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          oneshot.ai
        </Link>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </Link>
          </Button>

          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
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
