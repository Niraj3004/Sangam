"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, FolderPlus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      repositoryUrl: "",
      liveUrl: "",
      status: "open",
      roles: [{ title: "", description: "", requirements: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles"
  });

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((s: string) => s.trim()).filter(Boolean),
        roles: formData.roles.map((role: any) => ({
          title: role.title,
          description: role.description,
          requirements: role.requirements.split(',').map((s: string) => s.trim()).filter(Boolean)
        }))
      };

      const { data } = await api.post('/projects', payload);
      alert("Project created successfully!");
      router.push(`/projects/${data.data._id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </Link>

      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        
        <div className="p-8 border-b border-border bg-slate-50/50">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            Start a New Project
          </h1>
          <p className="text-muted mt-2 ml-13">Create a project profile and recruit your dream team.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
          
          <section>
            <h3 className="text-lg font-bold text-foreground mb-4">Project Details</h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Project Title *</label>
                <input
                  {...register("title", { required: true })}
                  placeholder="e.g. Sangam - Student Platform"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Description *</label>
                <textarea
                  {...register("description", { required: true })}
                  rows={4}
                  placeholder="What is this project about? What are you trying to build?"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Tags / Tech Stack</label>
                <input
                  {...register("tags")}
                  placeholder="e.g. Next.js, TypeScript, AI (comma separated)"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Repository URL</label>
                  <input
                    {...register("repositoryUrl")}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Live Demo URL</label>
                  <input
                    {...register("liveUrl")}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Open Roles</h3>
              <button
                type="button"
                onClick={() => append({ title: "", description: "", requirements: "" })}
                className="text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Role
              </button>
            </div>
            
            <p className="text-sm text-muted mb-6">Define the roles you are recruiting for. Students can apply to these specific positions.</p>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 rounded-2xl border border-border bg-slate-50/50 relative group">
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-6 right-6 p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="space-y-4 max-w-[90%]">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Role Title *</label>
                      <input
                        {...register(`roles.${index}.title` as const, { required: true })}
                        placeholder="e.g. Frontend Engineer"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Role Description *</label>
                      <input
                        {...register(`roles.${index}.description` as const, { required: true })}
                        placeholder="What will they be doing?"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Requirements (Comma separated)</label>
                      <input
                        {...register(`roles.${index}.requirements` as const)}
                        placeholder="e.g. React, Tailwind CSS"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-8 border-t border-border flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FolderPlus className="w-5 h-5" />}
              Launch Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
