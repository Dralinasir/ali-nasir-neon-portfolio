
"use client";

import { useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  description: string;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) throw new Error("Unable to load projects.");
      setProjects(await res.json());
    } catch {
      setError("Projects could not be loaded. Check the database connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(
        editingId === null ? "/api/projects" : `/api/projects/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        }
      );

      if (!res.ok) throw new Error("Save failed.");

      setTitle("");
      setDescription("");
      setEditingId(null);
      await loadProjects();
    } catch {
      setError("Unable to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    document.getElementById("project-form")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  async function deleteProject(id: number) {
    if (!window.confirm("Delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      await loadProjects();
    } catch {
      setError("Unable to delete project.");
    }
  }

  return (
    <main className="min-h-screen bg-[#101114] text-[#f5f3ed]">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <header className="flex items-center justify-between border-b border-white/10 py-7">
          <a href="#" className="text-lg font-semibold tracking-tight">
            AN<span className="text-[#c9ad84]">.</span>
          </a>
          <nav className="flex gap-6 text-xs uppercase tracking-[0.16em] text-white/60">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#project-form" className="hover:text-white">Manage</a>
          </nav>
        </header>

        <section id="about" className="grid gap-12 py-24 md:grid-cols-[1.6fr_1fr] md:py-32">
          <div>
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.3em] text-[#c9ad84]">
              Developer Portfolio / 2026
            </p>
            <h1 className="text-6xl font-medium leading-[1.05] tracking-[-0.06em] md:text-8xl">
              Ali Nasir<span className="text-[#c9ad84]">.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/55">
              Building thoughtful digital experiences through modern
              web development, functional design, and reliable technology.
            </p>
            <a
              href="#work"
              className="mt-10 inline-flex items-center gap-4 border-b border-[#c9ad84] pb-3 text-sm font-medium"
            >
              Explore selected work <span>↗</span>
            </a>
          </div>

          <div className="flex flex-col justify-end border-l border-white/10 pl-7">
            <span className="mb-5 text-xs uppercase tracking-[0.2em] text-white/40">
              Focus Areas
            </span>
            <div className="space-y-4 text-lg text-white/75">
              <p>01 / Web Development</p>
              <p>02 / Modern Interfaces</p>
              <p>03 / Database Integration</p>
            </div>
          </div>
        </section>

        <section id="work" className="border-t border-white/10 py-20">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#c9ad84]">
                Portfolio / Projects
              </p>
              <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
                Selected Work
              </h2>
            </div>
            <span className="text-sm text-white/40">
              {projects.length.toString().padStart(2, "0")} Projects
            </span>
          </div>

          {error && (
            <p role="alert" className="mb-8 rounded border border-red-400/30 p-4 text-sm text-red-300">
              {error}
            </p>
          )}

          {loading ? (
            <p className="py-12 text-white/50">Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="border border-white/10 p-10 md:p-16">
              <p className="text-xl">Your next project starts here.</p>
              <p className="mt-3 text-sm text-white/45">
                Add your first project using the form below.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  className="flex min-h-64 flex-col justify-between border border-white/10 bg-[#191a1e] p-8 transition-colors hover:border-[#c9ad84]/50"
                >
                  <div>
                    <span className="text-xs tracking-widest text-[#c9ad84]">
                      PROJECT {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-7 break-words text-2xl font-medium">
                      {project.title}
                    </h3>
                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-white/50">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-10 flex gap-6 border-t border-white/10 pt-5 text-xs uppercase tracking-widest">
                    <button
                      onClick={() => editProject(project)}
                      className="text-[#c9ad84] hover:text-white"
                    >
                      Edit ↗
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-white/40 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="project-form" className="border-t border-white/10 py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#c9ad84]">
                Project Management
              </p>
              <h2 className="text-4xl font-medium tracking-tight">
                {editingId === null ? "Add a project." : "Edit project."}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
                Manage your portfolio with a live PostgreSQL database.
                Changes are saved and remain available after refresh.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label htmlFor="title" className="mb-3 block text-xs uppercase tracking-widest text-white/50">
                  Project Title
                </label>
                <input
                  id="title"
                  required
                  maxLength={120}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  className="w-full rounded-none border border-white/15 bg-[#191a1e] px-5 py-4 text-white outline-none focus:border-[#c9ad84]"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-3 block text-xs uppercase tracking-widest text-white/50">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  maxLength={2000}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the project..."
                  className="w-full resize-y rounded-none border border-white/15 bg-[#191a1e] px-5 py-4 text-white outline-none focus:border-[#c9ad84]"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  disabled={saving}
                  type="submit"
                  className="bg-[#c9ad84] px-8 py-4 text-sm font-semibold text-[#101114] transition-colors hover:bg-[#e1c69e] disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId === null ? "Add Project ↗" : "Save Changes ↗"}
                </button>
                {editingId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setTitle("");
                      setDescription("");
                    }}
                    className="px-5 text-sm text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <footer className="flex flex-wrap justify-between gap-4 border-t border-white/10 py-9 text-xs text-white/35">
          <span>© {new Date().getFullYear()} Ali Nasir</span>
          <span>Designed & Developed with Next.js</span>
        </footer>
      </div>
    </main>
  );
}
