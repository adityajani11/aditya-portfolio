import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const BASE_PATH = "/aditya-portfolio";

function getHref(to: string): string {
  const cleanTo = to.startsWith("/") ? to : `/${to}`;
  const isBase = window.location.pathname.startsWith(BASE_PATH);
  return isBase ? `${BASE_PATH}${cleanTo}` : cleanTo;
}

type Project = {
  title: string;
  slug: string;
  category: string;
  description: string;
  stack: string[];
  href?: string;
  tone: string;
  number: string;
  image?: string;
};

const projects: Project[] = [
  {
    number: "01",
    title: "HeyHoodz",
    slug: "heyhoodz",
    category: "Shopify · Custom Build from Scratch",
    description:
      "An expressive streetwear storefront built 100% from scratch, engineered for culture-led storytelling and seamless checkout.",
    stack: ["Shopify Scratch Build", "Liquid", "Custom Theme", "CRO"],
    href: "https://heyhoodz.com/",
    tone: "lime",
    image: getHref("/assets/HeyHoodz.webp"),
  },
  {
    number: "02",
    title: "Sun Furniture Outlet",
    slug: "sun-furniture-outlet",
    category: "Shopify · Custom Build from Scratch",
    description:
      "A spacious home furniture retail storefront built entirely from scratch to make a broad catalogue simple and fast to explore.",
    stack: ["Shopify Scratch Build", "Liquid", "UX Strategy", "Performance"],
    href: "https://sunfurnitureoutlet.co.uk/",
    tone: "violet",
    image: getHref("/assets/SunFurniture.webp"),
  },
  {
    number: "03",
    title: "KSS - Attendance Management System",
    slug: "kss-attendance",
    category: "Custom SaaS - End-to-End Build",
    description:
      "A clear, dependable attendance management platform built 100% from scratch using React, Express, Node, MongoDB, and Bootstrap.",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "Bootstrap"],
    tone: "orange",
    image: getHref("/assets/KSS.webp"),
  },
  {
    number: "04",
    title: "KSS - Learning Material System",
    slug: "kss2-learning",
    category: "Custom SaaS · End-to-End Build",
    description:
      "A modern learning material management platform built 100% from scratch using React, Express, Node, MongoDB, and Tailwind CSS.",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    tone: "blue",
    image: getHref("/assets/KSS2.webp"),
  },
];

type RouteLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

function getNormalizedPath(): string {
  if (window.location.search.startsWith("?/")) {
    const queryRoute = window.location.search.slice(1);
    const cleanHref = getHref(queryRoute);
    window.history.replaceState({}, "", cleanHref);
    return queryRoute;
  }
  if (window.location.hash.startsWith("#/")) {
    const hashRoute = window.location.hash.slice(1);
    const cleanHref = getHref(hashRoute);
    window.history.replaceState({}, "", cleanHref);
    return hashRoute;
  }
  let path = window.location.pathname;
  if (path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length);
  }
  if (!path || !path.startsWith("/")) {
    path = "/" + path;
  }
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

let currentNormalizedPath = getNormalizedPath();
const routeSubscribers = new Set<() => void>();

function triggerAOSCheck() {
  const elements = document.querySelectorAll("[data-aos]:not(.aos-animate)");
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.3 && rect.bottom > -100) {
      el.classList.add("aos-animate");
    }
  });
}

function notifyRouteSubscribers() {
  const nextPath = getNormalizedPath();
  if (currentNormalizedPath !== nextPath) {
    currentNormalizedPath = nextPath;
    routeSubscribers.forEach((fn) => fn());
  }
}

function handleLocationChange() {
  notifyRouteSubscribers();
  window.scrollTo(0, 0);
  setTimeout(triggerAOSCheck, 0);
  setTimeout(triggerAOSCheck, 50);
}

window.addEventListener("popstate", handleLocationChange);
window.addEventListener("hashchange", handleLocationChange);

function navigate(to: string) {
  const fullPath = getHref(to);
  if (window.location.pathname + window.location.search + window.location.hash !== fullPath) {
    window.history.pushState({}, "", fullPath);
  }
  handleLocationChange();
}

function usePath(): string {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    routeSubscribers.add(listener);
    return () => {
      routeSubscribers.delete(listener);
    };
  }, []);

  return currentNormalizedPath;
}

function Link({ to, children, onClick, className, ...props }: RouteLinkProps) {
  const href = getHref(to);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      navigate(to);
    }
  };
  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

function NavLink({ to, children, className }: RouteLinkProps) {
  const currentPath = usePath();
  const normalizedTarget = to.startsWith("/") ? to : `/${to}`;
  const isActive =
    normalizedTarget === "/"
      ? currentPath === "/"
      : currentPath === normalizedTarget ||
      currentPath.startsWith(`${normalizedTarget}/`);

  return (
    <Link
      to={to}
      className={`${className || ""} ${isActive ? "active" : ""}`.trim()}
    >
      {children}
    </Link>
  );
}

function useAOS() {
  const path = usePath();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "50px 0px 50px 0px" }
    );

    const observeUnobserved = () => {
      triggerAOSCheck();
      const elements = document.querySelectorAll("[data-aos]:not(.aos-animate)");
      elements.forEach((el) => observer.observe(el));
    };

    observeUnobserved();

    const timer1 = setTimeout(observeUnobserved, 10);
    const timer2 = setTimeout(observeUnobserved, 100);
    const timer3 = setTimeout(observeUnobserved, 300);

    const mutationObserver = new MutationObserver(() => {
      observeUnobserved();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const handleScrollOrResize = () => triggerAOSCheck();
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [path]);
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress(window.scrollY / totalHeight);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="progress"
      style={{
        transform: `scaleX(${progress})`,
        transformOrigin: "left",
      }}
    />
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = usePath();

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <ScrollProgress />
      <header>
        <Link className="brand" to="/" aria-label="Aditya Jani — Home">
          <svg className="brand-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="38" height="38" rx="6" stroke="var(--mint)" strokeWidth="1" />
            <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="var(--mint)" fontSize="13" fontFamily="DM Mono, monospace" fontWeight="500" letterSpacing="1">AJ</text>
            <circle cx="35" cy="5" r="2" fill="var(--mint)" opacity="0.6" />
          </svg>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/work">Work</NavLink>
          <NavLink to="/services">Expertise</NavLink>
          <NavLink to="/about">Profile</NavLink>
        </nav>
        <div className="header-actions">
          <Link className="nav-cta" to="/contact">
            Start a project <i>↗</i>
          </Link>
          <button
            className={`menu-toggle ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-menu-container">
          <div className="mobile-menu-header">
            <span className="eyebrow">
              <span /> Navigation
            </span>
            <button
              className="mobile-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>
          <nav className="mobile-nav">
            <NavLink to="/">
              <span className="nav-label">
                <span className="nav-num">01</span> Home
              </span>
              <span className="nav-arrow">↗</span>
            </NavLink>
            <NavLink to="/work">
              <span className="nav-label">
                <span className="nav-num">02</span> Work
              </span>
              <span className="nav-arrow">↗</span>
            </NavLink>
            <NavLink to="/services">
              <span className="nav-label">
                <span className="nav-num">03</span> Expertise
              </span>
              <span className="nav-arrow">↗</span>
            </NavLink>
            <NavLink to="/about">
              <span className="nav-label">
                <span className="nav-num">04</span> Profile
              </span>
              <span className="nav-arrow">↗</span>
            </NavLink>
            <NavLink to="/contact">
              <span className="nav-label">
                <span className="nav-num">05</span> Start a Project
              </span>
              <span className="nav-arrow">↗</span>
            </NavLink>
          </nav>
          <div className="mobile-menu-footer">
            <p className="availability">
              <b /> Available for select engagements
            </p>
            <a href="mailto:hello@adityajani.dev">hello@adityajani.dev</a>
          </div>
        </div>
      </div>

      {children}
      <Footer />
    </>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
function Arrow() {
  return <span className="arrow">↗</span>;
}
function ProjectCard({
  project,
  featured = false,
  number,
}: {
  project: Project;
  featured?: boolean;
  number?: string;
}) {
  const displayNum = number || project.number;
  return (
    <article
      className={`project-card ${project.tone} ${featured ? "featured" : ""}`}
      data-aos="fade-up"
    >
      <div className="project-visual">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="project-image"
          />
        ) : (
          <div className="visual-mark">{project.title.slice(0, 1)}</div>
        )}
        <span className="project-number">{displayNum}</span>
        <span className="project-orbit" />
      </div>
      <div className="project-copy">
        <p className="project-category">{project.category}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.stack.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <div className="project-actions">
          {project.href && (
            <a href={project.href} target="_blank" rel="noreferrer">
              Visit live site <Arrow />
            </a>
          )}
          <Link to={`/case-studies/${project.slug}`}>
            View case study <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Home() {
  useAOS();
  return (
    <main>
      <section className="hero section">
        <div className="hero-top" data-aos="fade-up">
          <Eyebrow>Independent digital developer / India — worldwide</Eyebrow>
          <p className="availability">
            <b /> Available for select engagements
          </p>
        </div>
        <div className="hero-title">
          <p className="hero-kicker" data-aos="fade-up" data-aos-delay="100">
            Commerce, product, and the space between.
          </p>
          <h1 data-aos="fade-up" data-aos-delay="150">
            <span>Built to</span>
            <em>feel inevitable.</em>
          </h1>
          <div className="hero-foot" data-aos="fade-up" data-aos-delay="200">
            <p>
              I help ambitious teams turn good ideas into considered,
              high-performing digital experiences.
            </p>
            <Link to="/work">
              Scroll to explore <span>↓</span>
            </Link>
          </div>
        </div>
        <div className="hero-orb" data-aos="scale-up" data-aos-delay="300" aria-label="Tech radar texture">
          <svg viewBox="0 0 200 200" className="orb-texture-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Outer rings */}
            <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="0.6" opacity="0.2" fill="none" />
            <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.8" opacity="0.35" fill="none" />
            <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="1" opacity="0.55" fill="none" />
            {/* Dashed ring */}
            <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.75" fill="none" />
            {/* Inner solid ring */}
            <circle cx="100" cy="100" r="26" stroke="currentColor" strokeWidth="1.2" opacity="0.9" fill="none" />
            {/* Center fill */}
            <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.3" />
            <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.8" />
            {/* Crosshair lines */}
            <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
            {/* Short tick marks on outer ring */}
            <line x1="100" y1="4" x2="100" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <line x1="100" y1="184" x2="100" y2="196" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <line x1="4" y1="100" x2="16" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <line x1="184" y1="100" x2="196" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            {/* Diagonal fine guides */}
            <line x1="100" y1="100" x2="170" y2="30" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
            <line x1="100" y1="100" x2="30" y2="170" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
            <line x1="100" y1="100" x2="30" y2="30" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
            <line x1="100" y1="100" x2="170" y2="170" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
          </svg>
        </div>
      </section>
      <section className="work-intro section" id="selected">
        <div>
          <Eyebrow>Selected work</Eyebrow>
          <h2 data-aos="fade-up">
            Useful is the
            <br />
            <em>ultimate luxury.</em>
          </h2>
        </div>
        <p className="large-copy" data-aos="fade-up" data-aos-delay="100">
          A selection of custom Shopify storefronts and full-stack MERN SaaS platforms built 100% from scratch, made to be remarkably clear, fast, and hard to forget.
        </p>
      </section>
      <section className="section">
        <div className="project-grid">
          {projects.slice(0, 2).map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              number={String(i + 1).padStart(2, "0")}
              featured={i === 0}
            />
          ))}
          <div className="all-work" data-aos="fade-up">
            <Link to="/work">
              View all projects <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="manifesto section">
        <Eyebrow>The mindset</Eyebrow>
        <h2 data-aos="fade-up">
          Speed without noise.
          <br />
          <em>Craft without chaos.</em>
        </h2>
        <div className="manifesto-copy" data-aos="fade-up" data-aos-delay="100">
          <div>
            <p>
              Great digital products feel obvious in hindsight. I combine full-stack engineering precision with a clean design aesthetic to build systems that scale cleanly from day one.
            </p>
            <p>
              Whether engineering custom Shopify Liquid themes from scratch or developing full-stack SaaS platforms with React, Node, Express, MongoDB, Bootstrap, or Tailwind, every line of code serves a purpose.
            </p>
          </div>
          <Link to="/about">
            More about my approach <Arrow />
          </Link>
        </div>
        <div className="principles" data-aos="fade-up" data-aos-delay="200">
          <span>01 / Clarity over cleverness</span>
          <span>02 / Systems, not patches</span>
          <span>03 / Details create trust</span>
        </div>
      </section>
      <section className="capabilities section">
        <div className="cap-heading">
          <div>
            <Eyebrow>A focused practice</Eyebrow>
            <h2 data-aos="fade-up">
              What I bring to
              <br />
              the <em>table.</em>
            </h2>
          </div>
          <p data-aos="fade-up" data-aos-delay="100">
            End-to-end thinking, brought to the parts of your product that matter
            most.
          </p>
        </div>
        <div className="service-list">
          {[
            [
              "01",
              "Commerce that converts",
              "Custom Shopify builds from scratch, bespoke Liquid theme architecture, and conversion optimization.",
            ],
            [
              "02",
              "Custom SaaS platforms",
              "Full-stack MERN (React, Express, Node.js, MongoDB) SaaS products built 100% from scratch.",
            ],
            [
              "03",
              "Systems that can grow",
              "Clean component architecture with Bootstrap or Tailwind CSS tailored for intuitive daily usage.",
            ],
          ].map(([n, t, d], i) => (
            <div
              className="service-row"
              key={t}
              data-aos="fade-up"
              data-aos-delay={String(i * 100)}
            >
              <span>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
              <Arrow />
            </div>
          ))}
        </div>
      </section>
      <section className="process-strip section" data-aos="fade-up">
        <Eyebrow>From first thought to launch</Eyebrow>
        <div className="process-line">
          {["Listen", "Map", "Make", "Refine", "Release"].map((x, i) => (
            <React.Fragment key={x}>
              <span>
                {String(i + 1).padStart(2, "0")}
                <b>{x}</b>
              </span>
              {i < 4 && <i>→</i>}
            </React.Fragment>
          ))}
        </div>
      </section>
      <section className="closing section" data-aos="fade-up">
        <div className="closing-left">
          <p className="closing-note">Have an idea worth making real?</p>
          <h2>
            Let's make it
            <br />
            <em>matter.</em>
          </h2>
          <Link className="big-link" to="/contact">
            Start a conversation <Arrow />
          </Link>
        </div>
        <dl className="closing-sidebar">
          <div className="closing-sidebar-item">
            <dt>Currently</dt>
            <dd>
              <span style={{ color: "var(--mint)", marginRight: "6px" }}>●</span>
              Available for projects
            </dd>
          </div>
          <div className="closing-sidebar-item">
            <dt>Email</dt>
            <dd>
              <a href="mailto:business.aditya.jani@gmail.com">
                business.aditya.jani@gmail.com
              </a>
            </dd>
          </div>
          <div className="closing-sidebar-item">
            <dt>Based in</dt>
            <dd>India · IST (UTC+5:30)</dd>
          </div>
          <div className="closing-sidebar-item">
            <dt>Response time</dt>
            <dd>Within 24 hours</dd>
          </div>
          <div className="closing-sidebar-item">
            <dt>Specialty</dt>
            <dd>Shopify · Full-Stack MERN</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

function Work() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Shopify", "Custom SaaS"];

  const shown = projects.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Shopify") return p.category.toLowerCase().includes("shopify");
    if (filter === "Custom SaaS") return p.category.toLowerCase().includes("custom saas") || p.category.toLowerCase().includes("saas");
    return true;
  });

  useAOS();

  return (
    <main className="page section">
      <Eyebrow>Archive</Eyebrow>
      <h1 className="page-title">
        Selected projects,
        <br />
        built <em>from scratch.</em>
      </h1>
      <div className="filters" data-aos="fade-up" data-aos-delay="100">
        {categories.map((f) => (
          <button
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
            key={f}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="archive-grid">
        {shown.map((p, index) => (
          <ProjectCard
            project={p}
            number={String(index + 1).padStart(2, "0")}
            key={`${filter}-${p.slug}`}
          />
        ))}
      </div>
    </main>
  );
}

function CaseStudy({ project }: { project: Project }) {
  const details: Record<
    string,
    { challenge: string; response: string; outcome: string }
  > = {
    heyhoodz: {
      challenge:
        "Build a custom Shopify storefront completely from scratch for a growing streetwear brand without relying on generic pre-built templates.",
      response:
        "Engineered a bespoke Liquid theme from the ground up, placing high-impact product storytelling, custom drop mechanics, and rapid page load performance at the core.",
      outcome:
        "A 100% custom-built Shopify storefront that supports high-traffic drops, community discovery, and a confident customer purchase path.",
    },
    "sun-furniture-outlet": {
      challenge:
        "Architect a custom Shopify theme from scratch to organize an extensive furniture catalogue into a calm, reassuring retail experience.",
      response:
        "Developed custom Liquid templates and modular collection filters from scratch to guide buyers through product specifications and delivery options seamlessly.",
      outcome:
        "A high-performing bespoke Shopify store that delivers intuitive navigation, fast load speeds, and higher conversion rates.",
    },
    "kss-attendance": {
      challenge:
        "Architect and develop a complete attendance management system from scratch using React, Express, Node.js, and MongoDB.",
      response:
        "Built a full-stack MERN application styled with Bootstrap, creating focused daily attendance task paths, student record management, and administrative reports.",
      outcome:
        "A highly reliable custom SaaS platform deployed for administrative staff to record, monitor, and export school attendance effortlessly.",
    },
    "kss2-learning": {
      challenge:
        "Design and build a custom learning material management platform from scratch to streamline educational resource distribution.",
      response:
        "Engineered a full-stack MERN application (React, Node.js, Express.js, MongoDB) styled with Tailwind CSS, offering intuitive teacher dashboards and instant resource searching.",
      outcome:
        "A scalable, modern learning management system that empowers educators to organize, upload, and distribute study materials instantly.",
    },
  };
  const content = details[project.slug] || {
    challenge: project.description,
    response: "Engineered 100% from scratch with custom architecture tailored for performance and seamless user experience.",
    outcome: "Delivered a reliable, high-performing solution built to scale effortlessly.",
  };

  useAOS();

  return (
    <main className="case-study">
      <section className={`case-hero ${project.tone} section`} data-aos="fade-up">
        <Link to="/work" className="back-link">
          ← All work
        </Link>
        <p className="eyebrow">
          <span />
          Case study / {project.number}
        </p>
        <h1>{project.title}</h1>
        <p className="case-description">{project.description}</p>
        <div className="case-meta">
          <span>{project.category}</span>
          <span>{project.stack.join(" · ")}</span>
          {project.href && (
            <a href={project.href} target="_blank" rel="noreferrer">
              Visit live site ↗
            </a>
          )}
        </div>
        <div className="case-art">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="case-art-image"
            />
          ) : (
            <div className="visual-mark">{project.title.slice(0, 1)}</div>
          )}
        </div>
      </section>
      <section className="case-body section" data-aos="fade-up">
        <div className="case-label">The brief</div>
        <p className="case-lead">{content.challenge}</p>
        <div className="case-story">
          <div>
            <span>01</span>
            <h2>The challenge</h2>
            <p>{content.challenge}</p>
          </div>
          <div>
            <span>02</span>
            <h2>The response</h2>
            <p>{content.response}</p>
          </div>
          <div>
            <span>03</span>
            <h2>The outcome</h2>
            <p>{content.outcome}</p>
          </div>
        </div>
        <div className="case-quote">
          “Every detail should make the next decision feel easier.”
        </div>
      </section>
      <section className="case-next section" data-aos="fade-up">
        <p>Next in the archive</p>
        <Link
          to={`/case-studies/${projects[(projects.indexOf(project) + 1) % projects.length].slug}`}
        >
          {projects[(projects.indexOf(project) + 1) % projects.length].title}{" "}
          <Arrow />
        </Link>
      </section>
    </main>
  );
}
function Services() {
  const services = [
    [
      "Commerce, considered.",
      "Shopify store builds, custom themes, migrations, app integrations, performance tuning, and conversion-minded iteration.",
      "Shopify / BigCommerce",
    ],
    [
      "Digital products, made clear.",
      "SaaS platforms and admin systems that make complex operations feel simple for the people using them.",
      "MERN / Dashboards",
    ],
    [
      "Interfaces with intent.",
      "UX strategy and frontend engineering that turns product needs into compelling, responsive experiences.",
      "UI/UX / Frontend",
    ],
  ];
  return (
    <main className="page section">
      <Eyebrow>Ways of working</Eyebrow>
      <h1 className="page-title">
        Deep craft, built
        <br />
        around <em>your need.</em>
      </h1>
      <div className="service-detail">
        {services.map(([t, d, k], i) => (
          <article key={t} data-aos="fade-up" data-aos-delay={String(i * 100)}>
            <span>0{i + 1}</span>
            <div>
              <p className="project-category">{k}</p>
              <h2>{t}</h2>
              <p>{d}</p>
              <ul>
                <li>Defined outcomes</li>
                <li>Clear communication</li>
                <li>Built to last</li>
              </ul>
            </div>
          </article>
        ))}
      </div>
      <section className="mini-process" data-aos="fade-up">
        <Eyebrow>A shared rhythm</Eyebrow>
        <h2>
          Good work moves
          <br />
          with <em>momentum.</em>
        </h2>
        <p>
          Discovery → research → planning → design → development → testing →
          launch → support.
        </p>
      </section>
    </main>
  );
}
function About() {
  return (
    <main className="page section">
      <Eyebrow>Profile / Aditya Jani</Eyebrow>
      <h1 className="page-title">
        I care about the
        <br />
        <em>whole experience.</em>
      </h1>
      <div className="about-split">
        <div className="portrait-placeholder" data-aos="scale-up">
          <img
            src={getHref("/assets/AdityaImage.png")}
            alt="Aditya Jani"
            className="portrait-img"
          />
          <p>
            Working independently
            <br />
            from India, worldwide.
          </p>
        </div>
        <div>
          <p className="large-copy">
            I’m Aditya, a freelance developer working at the intersection of
            commerce, design, and technology. For more than two years, I’ve
            helped teams make their digital presence feel as good as their
            ambition.
          </p>
          <p>
            I believe clients value thoughtful judgment as much as technical
            range. That means asking the right questions early, sweating the
            invisible details, and making the final result feel simple.
          </p>
          <div className="stats" data-aos="fade-up">
            <span>
              <b>2+</b>Years professional
            </span>
            <span>
              <b>∞</b>Curiosity required
            </span>
            <span>
              <b>01</b>Point of contact
            </span>
          </div>
        </div>
      </div>
      <section className="values" data-aos="fade-up">
        <Eyebrow>Principles I keep close</Eyebrow>
        {[
          "Make the complex legible.",
          "Build trust through detail.",
          "Let the work do the talking.",
        ].map((x, i) => (
          <p key={x}>
            <span>0{i + 1}</span>
            {x}
          </p>
        ))}
      </section>
    </main>
  );
}
function Contact() {
  useAOS();
  return (
    <main className="contact-page section">
      <Eyebrow>New business / collaborations</Eyebrow>
      <h1>
        Tell me what's
        <br />
        on your <em>mind.</em>
      </h1>
      <div className="contact-info">
        <div className="contact-body">
          <p className="availability">
            <b /> Currently available
          </p>
          <p>
            I don't build generic template filler. I forge high-voltage, obsession-worthy digital products for brands that refuse to blend into the background.
          </p>
          <a href="mailto:business.aditya.jani@gmail.com">
            business.aditya.jani@gmail.com <Arrow />
          </a>
        </div>
        <dl className="contact-meta">
          <div>
            <dt>Based in</dt>
            <dd>India / IST</dd>
          </div>
          <div>
            <dt>Working with</dt>
            <dd>Teams worldwide</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
function Footer() {
  return (
    <footer>
      <p>
        Designed & engineered from scratch with intention.
        <br />© {new Date().getFullYear()} Aditya Jani. All rights reserved.
      </p>
    </footer>
  );
}
function App() {
  const path = usePath();
  useAOS();
  const pages: Record<string, React.ComponentType> = {
    "/": Home,
    "/work": Work,
    "/services": Services,
    "/about": About,
    "/contact": Contact,
  };
  const project = projects.find(
    (item) => path === `/case-studies/${item.slug}`,
  );
  const Page = pages[path] || Home;
  return <Shell>{project ? <CaseStudy project={project} /> : <Page />}</Shell>;
}
createRoot(document.getElementById("root")!).render(<App />);
