<script>
  import SEO from "$lib/components/SEO.svelte";
  import { projects } from "$lib/data/projects.js";
  import { onMount } from "svelte";

  const featuredProjects = projects.filter((p) => p.featured);

  // GitHub stats
  let ghStats = $state({ repos: "...", stars: "...", followers: "..." });
  let ghRepos = $state([]);
  let ghEvents = $state([]);
  let ghLimit = $state(false);
  let totalContribs = $state("...");

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  function langColor(lang) {
    const colors = {
      Java: "#b07219",
      JavaScript: "#f1e05a",
      Python: "#3572A5",
      TypeScript: "#2b7489",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
    };
    return colors[lang] || "#8b949e";
  }

  function eventIcon(type) {
    const icons = {
      PushEvent: "📝",
      CreateEvent: "✨",
      WatchEvent: "⭐",
      ForkEvent: "🍴",
      IssuesEvent: "🐛",
      PullRequestEvent: "🔀",
      DeleteEvent: "🗑️",
      ReleaseEvent: "🚀",
    };
    return icons[type] || "📌";
  }

  function eventDesc(event) {
    const repo = event.repo?.name?.split("/")[1] || event.repo?.name || "";
    const map = {
      PushEvent: `Pushed ${event.payload?.commits?.length ?? 1} commit(s) to ${repo}`,
      CreateEvent: `Created ${event.payload?.ref_type ?? "branch"} in ${repo}`,
      WatchEvent: `Starred ${repo}`,
      ForkEvent: `Forked ${repo}`,
      IssuesEvent: `${event.payload?.action ?? "updated"} issue in ${repo}`,
      PullRequestEvent: `${event.payload?.action ?? "opened"} PR in ${repo}`,
      DeleteEvent: `Deleted ${event.payload?.ref_type ?? "branch"} in ${repo}`,
      ReleaseEvent: `Released ${event.payload?.release?.tag_name ?? "new version"} in ${repo}`,
    };
    return map[event.type] || `${event.type} on ${repo}`;
  }

  // Lazy load Widgets component after initial render
  let Widgets = $state(null);
  let showWidgets = $state(false);

  onMount(async () => {
    // Fetch GitHub user + repos + events in parallel
    try {
      const [userRes, reposRes, eventsRes] = await Promise.all([
        fetch("https://api.github.com/users/Ayish-Shaikh"),
        fetch(
          "https://api.github.com/users/Ayish-Shaikh/repos?per_page=100&sort=pushed",
        ),
        fetch(
          "https://api.github.com/users/Ayish-Shaikh/events/public?per_page=20",
        ),
      ]);

      if (userRes.status === 403) {
        ghStats = { repos: "API", followers: "Limit", stars: "Reached" };
        ghLimit = true;
      } else if (userRes.ok) {
        const data = await userRes.json();
        ghStats = {
          repos: data.public_repos,
          followers: data.followers,
          stars: "...",
        };
      }

      if (reposRes.ok) {
        const repos = await reposRes.json();
        const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
        ghStats = { ...ghStats, stars: totalStars };
        ghRepos = repos.slice(0, 6);
      }

      if (eventsRes.ok) {
        const events = await eventsRes.json();
        // Filter meaningful events
        const filtered = events.filter((e) =>
          [
            "PushEvent",
            "CreateEvent",
            "WatchEvent",
            "ForkEvent",
            "PullRequestEvent",
            "ReleaseEvent",
          ].includes(e.type),
        );
        // Use filtered if available, otherwise use raw events, take up to 8
        ghEvents = (filtered.length > 0 ? filtered : events).slice(0, 8);
      }

      // Fetch contribution count
      const contribRes = await fetch(
        "https://github-contributions-api.deno.dev/Ayish-Shaikh.json",
      );
      if (contribRes.ok) {
        const contribData = await contribRes.json();
        totalContribs = contribData.totalContributions;
      }
    } catch (e) {
      ghStats = { repos: "—", stars: "—", followers: "—" };
    }

    // Delay widget loading to prioritize hero content
    await new Promise((resolve) => setTimeout(resolve, 100));
    const module = await import("$lib/components/Widgets.svelte");
    Widgets = module.default;
    showWidgets = true;
  });

  const techStack = [
    { label: "Java", angle: 0, color: "#f89820", icon: "☕" },
    { label: "Spring", angle: 120, color: "#6db33f", icon: "🍃" },
    { label: "React", angle: 240, color: "#61dafb", icon: "⚛" },
  ];
</script>

<SEO
  title="Ayish Shaikh — Java Full Stack Developer"
  description="Portfolio of Ayish Shaikh, Java Full Stack Developer specializing in Spring Boot, REST APIs, and React. Based in Kolkata, India."
  canonical="https://ayishshaikh.vercel.app"
  type="website"
/>

<section class="hero">
  <div class="hero-inner">
    <!-- Left: Text Content -->
    <div class="hero-text-col">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        <span>Open to opportunities</span>
      </div>

      <h1 class="hero-title">
        Hey! I'm <span class="accent">Ayish Shaikh</span>
      </h1>

      <p class="hero-subtitle">Java Full Stack Developer</p>

      <p class="hero-text">
        Aspiring developer specializing in <strong>Spring Boot</strong>
        backends, <strong>REST APIs</strong>, and <strong>React</strong>
        frontends. I build scalable, clean-architecture systems — currently pursuing
        B.Tech CS at <em>Swami Vivekananda University</em>.
      </p>

      <!-- Location -->
      <div class="hero-meta">
        <span class="meta-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
              cx="12"
              cy="10"
              r="3"
            /></svg
          >
          Kolkata, India
        </span>
        <span class="meta-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path
              d="M6 12v5c3 3 9 3 12 0v-5"
            /></svg
          >
          B.Tech CS, SVU
        </span>
      </div>

      <!-- CTA chips -->
      <div class="hero-chips">
        <a
          href="https://github.com/Ayish-Shaikh"
          target="_blank"
          rel="noopener noreferrer"
          class="chip chip-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            ><path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            /></svg
          >
          <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/ayish-shaikh-5ab441321/"
          target="_blank"
          rel="noopener noreferrer"
          class="chip"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            ><path
              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            /></svg
          >
          <span>LinkedIn</span>
        </a>
        <a
          href="/resume.html"
          target="_blank"
          rel="noopener noreferrer"
          class="chip chip-resume"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            /><polyline points="14 2 14 8 20 8" /><line
              x1="16"
              y1="13"
              x2="8"
              y2="13"
            /><line x1="16" y1="17" x2="8" y2="17" /><polyline
              points="10 9 9 9 8 9"
            /></svg
          >
          <span>Resume</span>
        </a>
        <a href="/about" class="chip">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path
              d="M12 8h.01"
            /></svg
          >
          <span>About Me</span>
        </a>
      </div>
    </div>

    <!-- Right: Avatar + Rotating Ring -->
    <div class="hero-avatar-col">
      <div class="orbit-wrapper">
        <!-- Rotating orbit ring with tech icons -->
        <div class="orbit-ring">
          {#each techStack as tech, i}
            <div
              class="orbit-node"
              style="
                --angle: {tech.angle}deg;
                --color: {tech.color};
              "
            >
              <div class="orbit-icon">
                <span>{tech.icon}</span>
                <span class="orbit-label">{tech.label}</span>
              </div>
            </div>
          {/each}
        </div>

        <!-- Center: Cat Avatar -->
        <div class="avatar-center">
          <img
            src="https://cataas.com/cat/cute?width=180&height=180"
            alt="Cute cat avatar"
            class="cat-img"
            loading="eager"
          />
          <div class="avatar-glow"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- GitHub Activity Section -->
<section class="github-activity-section">
  <div class="section-header">
    <h2 class="section-title">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z"
        />
      </svg>
      <span>GitHub Activity</span>
    </h2>
  </div>

  <div class="gh-contrib-card">
    <div class="chart-container">
      <img
        src="https://ghchart.rshah.org/39d353/Ayish-Shaikh"
        alt="GitHub contribution chart for Ayish Shaikh"
        class="contrib-chart"
        loading="lazy"
      />
    </div>
    <div class="contrib-footer">
      <span class="contrib-count"
        >{totalContribs} contributions in the last year</span
      >
    </div>
  </div>
</section>

<section class="projects-section">
  <div class="section-header">
    <h2 class="section-title">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      <span>Featured Projects</span>
    </h2>
  </div>
  <div class="projects-grid">
    {#each featuredProjects as project, index}
      <article class="project-card">
        {#if project.slug}
          <a href="/projects/{project.slug}" class="project-link">
            {#if project.image}
              <img
                src={project.image}
                alt="{project.title} screenshot"
                class="project-img"
              />
            {/if}
            <div class="project-content">
              <h3 class="project-title">{project.title}</h3>
              <p class="project-desc">{project.description}</p>
              <div class="project-tags">
                {#each project.tags as tag}
                  <span class="project-tag">{tag}</span>
                {/each}
              </div>
            </div>
          </a>
        {:else}
          {#if project.image}
            <img
              src={project.image}
              alt="{project.title} screenshot"
              class="project-img"
            />
          {/if}
          <div class="project-content">
            <h3 class="project-title">{project.title}</h3>
            <p class="project-desc">{project.description}</p>
            <div class="project-tags">
              {#each project.tags as tag}
                <span class="project-tag">{tag}</span>
              {/each}
            </div>
          </div>
        {/if}
      </article>
    {/each}
  </div>
  <div class="view-all-container">
    <a href="/projects" class="view-all-btn">
      <span>View All Projects</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  </div>
</section>

<!-- Interactive Widgets Section -->
<div class="widgets-fullwidth-container">
  {#if showWidgets && Widgets}
    <Widgets />
  {/if}
</div>

<style>
  /* ===== NEW HERO LAYOUT ===== */
  .hero {
    padding: 3rem 0 2rem;
  }

  .hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  @media (max-width: 900px) {
    .hero-inner {
      grid-template-columns: 1fr;
    }
    .hero-avatar-col {
      order: -1;
    }
  }

  /* Badge */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.9rem;
    background: rgba(var(--accent-rgb), 0.1);
    border: 1px solid rgba(var(--accent-rgb), 0.3);
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--accent);
    margin-bottom: 1.25rem;
  }

  .badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.8);
    }
  }

  /* Title / subtitle */
  .hero-title {
    margin: 0 0 0.5rem;
    font-size: clamp(1.9rem, 5vw, 3rem);
    font-weight: var(--font-weight-bold);
    line-height: 1.15;
    color: var(--text);
  }

  .hero-title .accent {
    color: var(--accent);
  }

  .hero-subtitle {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--accent);
    opacity: 0.85;
  }

  .hero-text {
    margin: 0 0 1.25rem;
    max-width: 60ch;
    font-size: 0.97rem;
    line-height: 1.75;
    color: var(--subtext1);
  }

  /* Location / meta */
  .hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--subtext0);
  }

  .meta-item svg {
    color: var(--accent);
    flex-shrink: 0;
  }

  /* ===== GITHUB ACTIVITY SECTION ===== */
  .github-activity-section {
    padding-top: 3rem;
  }

  .gh-contrib-card {
    background: transparent;
    border: 1px solid var(--surface0);
    border-radius: 16px;
    padding: 1.5rem 2rem; /* Balanced padding */
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 1000px; /* Middle ground width */
    margin-left: 0; /* Align to left */
  }

  .contrib-footer {
    display: flex;
    justify-content: center;
    padding-top: 0.75rem;
    border-top: 1px solid var(--surface0);
  }

  .contrib-count {
    font-size: 0.75rem; /* Slightly smaller text */
    color: var(--subtext0);
    font-weight: 500;
  }

  .chart-container {
    width: 100%;
    overflow: hidden;
    height: 100px; /* Adjusted height for better balance */
    display: flex;
    justify-content: flex-end;
  }

  .contrib-chart {
    height: 100%;
    width: 250%; /* Make it wider so we can crop it */
    object-fit: cover;
    object-position: right; /* Show only the past 6 months (right side of the image) */
    filter: saturate(1.8) brightness(1.1)
      drop-shadow(0 0 8px rgba(57, 211, 83, 0.15));
    transition: filter 0.3s ease;
  }

  /* Chips */
  .hero-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text);
    background: transparent;
    border: 1px solid var(--surface1);
    border-radius: var(--radius-full);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .chip::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 0;
  }

  .chip svg,
  .chip span {
    position: relative;
    z-index: 1;
  }
  .chip svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .chip:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .chip:hover::before {
    opacity: 0.1;
  }
  .chip:hover svg {
    transform: scale(1.1);
  }
  .chip:active {
    transform: translateY(0);
  }

  .chip-primary {
    background: var(--accent);
    color: var(--mantle);
    border-color: var(--accent);
  }
  .chip-primary::before {
    background: rgba(255, 255, 255, 0.2);
  }
  .chip-primary:hover {
    filter: brightness(1.1);
  }

  .chip-resume {
    border-color: rgba(var(--blue-rgb), 0.5);
    color: var(--blue);
  }
  .chip-resume::before {
    background: var(--blue);
  }
  .chip-resume:hover {
    border-color: var(--blue);
  }

  /* ===== ORBIT AVATAR ===== */
  .hero-avatar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .orbit-wrapper {
    position: relative;
    width: 380px;
    height: 380px;
  }

  /* The outer dashed ring */
  .orbit-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px dashed rgba(var(--accent-rgb), 0.3);
    animation: orbit-spin 12s linear infinite;
  }

  @keyframes orbit-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Each node is placed around the ring */
  .orbit-node {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 52px;
    height: 52px;
    margin-top: -26px;
    margin-left: -26px;
    transform: rotate(var(--angle)) translateY(-185px)
      rotate(calc(-1 * var(--angle)));
  }

  .orbit-icon {
    width: 52px;
    height: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    background: var(--surface0);
    border: 2px solid var(--color);
    border-radius: 50%;
    font-size: 1.2rem;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
    animation: orbit-counter 12s linear infinite;
  }

  @keyframes orbit-counter {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  .orbit-label {
    font-size: 0.45rem;
    font-weight: 700;
    color: var(--color);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Center avatar */
  .avatar-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 240px;
    height: 240px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--accent);
    box-shadow:
      0 0 0 6px rgba(var(--accent-rgb), 0.15),
      0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .cat-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* GitHub contribution chart */
  .gh-contrib {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1.5rem;
    background: #0d1117; /* Deep dark background like GitHub */
    border: 1px solid #30363d;
    border-radius: 16px;
    box-shadow:
      0 10px 30px -10px rgba(0, 0, 0, 0.5),
      inset 0 1px 1px rgba(255, 255, 255, 0.05);
    margin-top: 1.5rem;
    transition:
      transform 0.3s ease,
      border-color 0.3s ease;
  }

  .gh-contrib:hover {
    border-color: #39d353;
    transform: translateY(-4px);
  }

  .contrib-chart {
    width: 100%;
    height: auto;
    border-radius: 4px;
    filter: saturate(1.8) brightness(1.1)
      drop-shadow(0 0 8px rgba(57, 211, 83, 0.15));
    transition: filter 0.3s ease;
  }
  .gh-contrib:hover .contrib-chart {
    filter: saturate(2) brightness(1.2)
      drop-shadow(0 0 12px rgba(57, 211, 83, 0.25));
  }

  .contrib-label {
    font-size: 0.75rem;
    color: var(--subtext0);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ===== GITHUB ACTIVITY ===== */
  .gh-activity-section {
    padding: 3rem 0 1rem;
  }

  .gh-activity-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .gh-activity-inner {
      grid-template-columns: 1fr;
    }
  }

  .gh-block {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .gh-section-title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 0.75rem;
  }
  .gh-section-title svg {
    color: var(--accent);
    flex-shrink: 0;
  }

  .gh-loading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem;
    color: var(--subtext0);
    font-size: 0.875rem;
  }
  .gh-loader {
    width: 18px;
    height: 18px;
    border: 2px solid var(--surface1);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .gh-error {
    padding: 1.5rem;
    background: rgba(var(--red-rgb, 243, 139, 168), 0.1);
    border: 1px dashed var(--red);
    border-radius: var(--radius-md);
    color: var(--subtext1);
    font-size: 0.85rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .view-profile-link {
    font-size: 0.8rem;
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 4px;
    font-weight: 600;
  }

  /* Repo cards */
  .repo-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .repo-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.9rem 1rem;
    background: var(--surface0);
    border: 1px solid var(--surface1);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.2s ease;
  }
  .repo-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  }

  .repo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .repo-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--accent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .repo-stars {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--subtext0);
    flex-shrink: 0;
  }
  .repo-stars svg {
    color: #f9e2af;
  }

  .repo-desc {
    font-size: 0.8rem;
    color: var(--subtext0);
    line-height: 1.4;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .repo-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--subtext1);
    margin-top: 0.1rem;
  }

  .repo-lang {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .lang-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .repo-updated {
    color: var(--subtext1);
  }

  /* Event list */
  .event-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .event-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.65rem 0;
    border-bottom: 1px solid var(--surface0);
  }
  .event-item:last-child {
    border-bottom: none;
  }

  .event-icon {
    font-size: 1rem;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface0);
    border-radius: var(--radius-sm);
  }

  .event-body {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .event-desc {
    font-size: 0.83rem;
    color: var(--text);
    margin: 0;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .event-time {
    font-size: 0.72rem;
    color: var(--subtext0);
  }

  /* ===== PROJECTS ===== */
  .projects-section {
    padding-top: 3rem;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 2rem;
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 700;
    color: var(--text);
  }

  .section-title svg {
    color: var(--accent);
    flex-shrink: 0;
  }

  .view-all-container {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
  }

  .view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.95rem 1.75rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--mantle);
    background: linear-gradient(
      135deg,
      var(--accent) 0%,
      rgba(var(--blue-rgb), 0.8) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-full);
    text-decoration: none;
    position: relative;
    overflow: visible;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3);
  }

  @media (max-width: 768px) {
    .view-all-btn {
      padding: 0.85rem 1.5rem;
      font-size: 0.875rem;
      gap: 0.5rem;
    }
  }

  .view-all-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
    border-radius: var(--radius-full);
  }

  .view-all-btn span,
  .view-all-btn svg {
    position: relative;
    z-index: 1;
  }

  .view-all-btn svg {
    transition: transform 0.3s ease;
  }

  .view-all-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(var(--accent-rgb), 0.5);
    filter: brightness(1.1);
  }

  .view-all-btn:hover::before {
    opacity: 1;
  }

  .view-all-btn:hover svg {
    transform: translateX(6px);
  }

  .view-all-btn:active {
    transform: translateY(0);
  }

  .section-header h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text);
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-lg);
    border: 1px solid var(--surface0);
    background: var(--base);
    overflow: hidden;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow:
      var(--shadow-lg),
      0 0 0 1px rgba(var(--accent-rgb), 0.15);
    border-color: rgba(var(--accent-rgb), 0.3);
  }

  .project-link {
    display: flex;
    flex-direction: column;
    flex: 1;
    text-decoration: none;
    color: inherit;
  }

  .project-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .project-content {
    flex: 1;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .project-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text);
  }

  .project-desc {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--subtext0);
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .project-tag {
    padding: 0.25rem 0.6rem;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--accent);
    background: rgba(var(--accent-rgb), 0.15);
    border-radius: var(--radius-sm);
  }

  .widgets-fullwidth-container {
    width: 100%;
    /* No max-width to span full width like footer */
    margin: 0;
    padding: 0; /* Set padding to 0 */
  }
</style>
