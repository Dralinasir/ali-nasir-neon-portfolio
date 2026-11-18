
"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Project = {
  id: number;
  title: string;
  description: string;
};

const featured = [
  {
    title: "AI Chatbot",
    type: "Artificial Intelligence",
    description:
      "A conversational AI project exploring intelligent and interactive digital experiences.",
    url: "https://ai-chatbot-ali-2115.vercel.app/",
    image: "/projects/chatbot.png",
    color: "purple",
    initials: "AI",
  },
  {
    title: "Freshora",
    type: "E-Commerce",
    description:
      "A grocery shopping experience focused on product discovery and a modern interface.",
    url: "https://freshora-tawny.vercel.app/",
    image: "/projects/freshora.png",
    color: "green",
    initials: "FR",
  },
  {
    title: "Attendance Management",
    type: "Web Application",
    description:
      "A practical application for organizing student records, attendance and reports.",
    url: "https://cdc-gray.vercel.app/",
    image: "/projects/attendance.png",
    color: "blue",
    initials: "AM",
  },
  {
    title: "Personal Portfolio",
    type: "Portfolio",
    description:
      "A developer portfolio presenting professional information, skills and projects.",
    url: "https://asif-lake.vercel.app/",
    image: "/projects/portfolio.png",
    color: "violet",
    initials: "PF",
  },
];

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "PostgreSQL",
  "NeonDB",
  "Vercel",
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function ProjectPreview({
  image,
  title,
  initials,
  color,
}: {
  image: string;
  title: string;
  initials: string;
  color: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`project-visual ${color}`}>
      {!failed ? (
        <Image
          src={image}
          alt={`${title} website preview`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
          className="project-screenshot"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="project-placeholder">
          <span>{initials}</span>
          <small>{title}</small>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to retrieve projects.");
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected database response.");
      }

      setProjects(data as Project[]);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !description.trim() || saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        editingId === null
          ? "/api/projects"
          : `/api/projects/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Unable to save project.");
      }

      const wasEditing = editingId !== null;

      setTitle("");
      setDescription("");
      setEditingId(null);

      await loadProjects();

      setSuccess(
        wasEditing
          ? "Project updated successfully."
          : "Project added successfully."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(project: Project) {
    setTitle(project.title);
    setDescription(project.description);
    setEditingId(project.id);
    setManagerOpen(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      document.getElementById("project-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Delete request failed.");
      }

      if (editingId === id) resetForm();

      await loadProjects();
      setSuccess("Project deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  function openManager() {
    setManagerOpen(true);

    setTimeout(() => {
      document.getElementById("database")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  return (
    <main>
      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label="Ali Nasir Home">
            <span className="brand-symbol">
              A<span>N</span>
            </span>
            <span className="brand-divider" />
            <span className="brand-copy">
              <strong>ALI NASIR</strong>
              <small>AI & Web Developer</small>
            </span>
          </a>

          <nav className={menuOpen ? "navigation open" : "navigation"}>
            {[
              ["Home", "#home"],
              ["About", "#about"],
              ["Projects", "#projects"],
              ["Database", "#database"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>

          <a className="header-contact" href="#contact">
            Let&apos;s Connect <Arrow diagonal />
          </a>

          <button
            className="mobile-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              AI & CHATBOT DEVELOPER
            </div>

            <h1>
              Building
              <br />
              Intelligent
              <br />
              Web <span>Solutions.</span>
            </h1>

            <p className="hero-description">
              I build AI-powered applications, conversational interfaces
              and modern web experiences with a focus on practical
              solutions and thoughtful design.
            </p>

            <div className="hero-actions">
              <a className="button button-orange" href="#projects">
                Explore Projects <Arrow diagonal />
              </a>
              <a className="button button-outline" href="#about">
                About Me <Arrow />
              </a>
            </div>

            <div className="hero-micro">
              <span className="live-dot" />
              AI Development
              <span className="micro-separator">/</span>
              Full-Stack Applications
            </div>
          </div>

          <div className="hero-portrait">
            <div className="portrait-shape" />
            <div className="portrait-ring" />
            <div className="portrait-watermark">AN</div>
            <div className="portrait-frame">
              <Image
                src="/ali-nasir.jpg"
                alt="Ali Nasir"
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 420px"
                className="portrait-image"
              />
            </div>
            <div className="floating-chip chip-code">{"</>"}</div>
            <div className="floating-chip chip-ai">AI</div>
          </div>

          <aside className="hero-info" id="about">
            <div className="info-block">
              <div className="info-icon">◇</div>
              <div>
                <h3>Education</h3>
                <strong>O Levels & A Levels</strong>
                <p>Beaconhouse School System</p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">▱</div>
              <div>
                <h3>Focus Area</h3>
                <strong>AI & Chatbot Development</strong>
                <p>Web Applications · Databases · Modern UI</p>
              </div>
            </div>

            <div className="info-tech">
              <div className="info-tech-heading">
                <span className="info-icon">{"</>"}</span>
                <h3>Tech Stack</h3>
              </div>

              <div className="tech-pills">
                {technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SPECIALIZATION STRIP */}
      <section className="specialization-strip">
        <div className="strip-dark">
          <div className="strip-stat">
            <span className="strip-icon">{"</>"}</span>
            <div>
              <strong>04</strong>
              <small>Featured Projects</small>
            </div>
          </div>

          <div className="strip-stat">
            <span className="strip-icon">✳</span>
            <div>
              <strong>AI</strong>
              <small>Specialization</small>
            </div>
          </div>

          <div className="strip-stat">
            <span className="strip-icon">◇</span>
            <div>
              <strong>A Levels</strong>
              <small>Beaconhouse</small>
            </div>
          </div>

          <div className="strip-stat">
            <span className="strip-icon">◇</span>
            <div>
              <strong>O Levels</strong>
              <small>Beaconhouse</small>
            </div>
          </div>
        </div>

        <div className="strip-orange">
          <span>✧</span>
          AI SOLUTIONS
          <b>/</b>
          WEB APPLICATIONS
          <b>/</b>
          DATABASE SYSTEMS
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects-section" id="projects">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                SELECTED WORK / 2026
              </span>
              <h2>
                FEATURED <span>PROJECTS.</span>
              </h2>
            </div>

            <p>
              A collection of deployed applications and practical
              development projects.
            </p>
          </div>

          <div className="featured-grid">
            {featured.map((project, index) => (
              <article
                className="featured-card"
                key={project.title}
              >
                <div className="card-top">
                  <span className="card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <ProjectPreview
                    image={project.image}
                    title={project.title}
                    initials={project.initials}
                    color={project.color}
                  />
                </div>

                <div className="featured-card-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="card-footer">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project <Arrow diagonal />
                    </a>
                    <span className={`category-pill ${project.color}`}>
                      {project.type}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DATABASE BANNER */}
      <section className="database-section" id="database">
        <div className="container">
          <div className="database-banner">
            <div className="database-art">
              <div className="database-glow" />
              <span>▤</span>
            </div>

            <div className="database-title">
              <span className="section-kicker">
                FULL-STACK DEVELOPMENT
              </span>
              <h2>
                Manage Projects
                <br />
                <span>(NeonDB)</span>
              </h2>
            </div>

            <p>
              Add, edit and delete project records using Next.js API
              routes and Neon PostgreSQL.
            </p>

            <button
              className="button button-orange"
              type="button"
              onClick={() => setManagerOpen(!managerOpen)}
              aria-expanded={managerOpen}
              aria-controls="project-manager"
            >
              {managerOpen ? "Close Manager" : "Open Project Manager"}
              <Arrow diagonal />
            </button>
          </div>

          {managerOpen && (
            <div className="project-manager" id="project-manager">
              <div className="manager-header">
                <div>
                  <span className="section-kicker">
                    LIVE DATABASE / CRUD
                  </span>
                  <h2>Project Manager</h2>
                  <p>
                    Records are retrieved from the connected PostgreSQL
                    database.
                  </p>
                </div>

                <span className="record-count">
                  {projects.length} Records
                </span>
              </div>

              {error && (
                <div className="manager-alert error" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="manager-alert success" role="status">
                  {success}
                </div>
              )}

              <div className="manager-layout">
                <div className="manager-list">
                  <h3>Saved Projects</h3>

                  {loading ? (
                    <p className="manager-muted">Loading projects...</p>
                  ) : projects.length === 0 ? (
                    <p className="manager-muted">
                      No projects have been added yet.
                    </p>
                  ) : (
                    projects.map((project) => (
                      <div className="database-card" key={project.id}>
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>

                        <div className="database-card-actions">
                          <button
                            type="button"
                            onClick={() => startEdit(project)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="danger"
                            disabled={deletingId === project.id}
                            onClick={() => void handleDelete(project.id)}
                          >
                            {deletingId === project.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  className="manager-form"
                  id="project-form"
                  onSubmit={handleSubmit}
                >
                  <h3>
                    {editingId === null
                      ? "Add New Project"
                      : "Edit Project"}
                  </h3>

                  <label htmlFor="project-title">Project Title</label>
                  <input
                    id="project-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter project title"
                    maxLength={120}
                    required
                  />

                  <label htmlFor="project-description">
                    Project Description
                  </label>
                  <textarea
                    id="project-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Describe your project"
                    rows={5}
                    maxLength={2000}
                    required
                  />

                  <button
                    type="submit"
                    className="button button-orange"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId === null
                        ? "Add Project"
                        : "Save Changes"}
                    <Arrow diagonal />
                  </button>

                  {editingId !== null && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={resetForm}
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="container contact-inner">
          <div>
            <span className="section-kicker">LET&apos;S CONNECT</span>
            <h2>
              BUILD SOMETHING
              <br />
              <span>INTELLIGENT.</span>
            </h2>
          </div>

          <div className="contact-right">
            <p>
              Explore my work, development projects and experiments
              through GitHub.
            </p>

            <a
              className="button button-orange"
              href="https://github.com/Dralinasir"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit GitHub <Arrow diagonal />
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <strong>AN<span>.</span></strong>
            <div>
              <b>ALI NASIR</b>
              <small>AI & Web Developer</small>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#database">Database</a>
            <a href="#contact">Contact</a>
          </nav>

          <p>© {new Date().getFullYear()} Ali Nasir.</p>
        </div>
      </footer>
    </main>
  );
}
