"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AI_OPTIONS } from "@/constants/ai-options";
import { createClient } from "@/lib/supabase/client";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  live_link: z.string().url("Please enter a valid URL"),
  github_link: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  developed_by: z
    .string()
    .min(2, "Developer name must be at least 2 characters"),
  ai_used: z.string().min(1, "Please select an AI"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddProjectModal({
  isOpen,
  onClose,
}: AddProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      live_link: "",
      github_link: "",
      developed_by: "",
      ai_used: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("projects")
        .insert([
          {
            ...values,
            likes: 0,
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Project added successfully!", {
        description: "Your project has been added to the feed.",
      });

      const { data: refreshedProjects } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      const event = new CustomEvent("projectAdded", {
        detail: refreshedProjects,
      });
      window.dispatchEvent(event);

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Error adding project", {
        description:
          "There was an error adding your project. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add a new AI project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Amazing AI Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="live_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://myproject.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="developed_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Developed By</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name or handle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ai_used"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Used</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AI_OPTIONS.map((ai) => (
                        <SelectItem key={ai.value} value={ai.value}>
                          {ai.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of your project"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
