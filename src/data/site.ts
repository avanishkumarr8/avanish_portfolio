export const site = {
  name: "Avanish Kumar",
  brand: "AVANISH",
  title: "FRONTEND ENGINEER",
  location: "Delhi NCR, India",
  email: "avanishkumarr8@gmail.com",
  phone: "+91-7834873044",
  summary:
    "Frontend Engineer with 3.10+ years building scalable, high-performance React and Next.js applications — GraphQL workflows, dynamic form builders, content publishing, and data-intensive dashboards.",
  heroLine:
    "I ship responsive product surfaces with TypeScript, clean state architecture, and release-quality testing.",
  stats: [
    { value: "3.10+", label: "Years" },
    { value: "5", label: "Key Projects" },
    { value: "2", label: "Companies" },
  ],
  portrait: "/portrait.png",
  links: {
    github: "https://github.com/avanishkumarr8",
    linkedin: "https://www.linkedin.com/in/avanish-a257131ab/",
    portfolio: "#work",
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "Work", href: "#work" },
    { label: "Impact", href: "#impact" },
    { label: "About", href: "#about" },
    { label: "Journey", href: "#journey" },
    { label: "Contact", href: "#contact" },
  ],
  filters: ["All", "Next.js", "React", "Dashboards", "Marketing"] as const,
  projects: [
    {
      id: "01",
      title: "Datopic Web & HR Dashboard",
      category: "Dashboards",
      tags: ["React.js", "Material-UI", "Redux-Saga", "PostgreSQL"],
      filter: ["All", "React", "Dashboards"],
      href: "https://www.datopic.com",
      period: "Dec 2024 – Present",
      blurb:
        "Enterprise web app and HR dashboard with reusable components and scalable async state — improving interaction by ~30%.",
      accent: "from-red-900/80 to-zinc-900",
      image: "/projects/datopic-admin.png",
    },
    {
      id: "02",
      title: "Datopic Marketing Site",
      category: "Marketing",
      tags: ["Next.js", "TypeScript", "Material-UI", "REST"],
      filter: ["All", "Next.js", "Marketing", "React"],
      href: "https://www.datopic.com",
      period: "Feb 2024 – Present",
      blurb:
        "Marketing site with reusable React components and content publishing for blogs, whitepapers, and case studies.",
      accent: "from-zinc-800 to-red-950/70",
      image: "/projects/datopic-marketing.png",
    },
    {
      id: "03",
      title: "Nuestack Technologies",
      category: "Marketing",
      tags: ["React.js", "Redux", "Bootstrap", "Axios"],
      filter: ["All", "React", "Marketing"],
      href: "https://nuestack.in",
      period: "Feb 2024 – Dec 2024",
      blurb:
        "UI-centric marketing application with Redux state, responsive layouts, and REST integration.",
      accent: "from-neutral-800 to-zinc-950",
      image: "/projects/nuestack.png",
    },
    {
      id: "04",
      title: "Craft Silicon — Loan Origination",
      category: "Dashboards",
      tags: ["React.js", "Redux", "Ant Design", "Firebase"],
      filter: ["All", "React", "Dashboards"],
      href: "#",
      period: "Nov 2022 – Jun 2023",
      blurb:
        "Loan Origination System UI flows with Redux state and Firebase SMS OTP for secure authentication.",
      accent: "from-stone-800 to-red-950/50",
      image: null,
    },
    {
      id: "05",
      title: "Kisan Manch Admin Portal",
      category: "Dashboards",
      tags: ["React.js", "Material-UI", "Context API", "MySQL"],
      filter: ["All", "React", "Dashboards"],
      href: "https://www.rcfltd.com",
      period: "Mar 2022 – Nov 2022",
      blurb:
        "Admin portal to manage chemicals, fertilizers, and tools with Context API and Axios-backed MySQL APIs.",
      accent: "from-zinc-900 to-neutral-800",
      image: "/projects/kisan-manch.png",
    },
  ],
  milestones: [
    {
      title: "GraphQL data workflows & async optimization",
      detail: "Reduced over-fetching and improved frontend render speed at Datopic.",
      year: "2025",
    },
    {
      title: "Content publishing for marketing teams",
      detail: "Blogs, whitepapers, and case studies with preview and media support.",
      year: "2024",
    },
    {
      title: "Enterprise banking & recruitment apps",
      detail: "React + TypeScript surfaces with MUI / Ant Design at IDC Technologies.",
      year: "2023",
    },
    {
      title: "Performance: virtualization & code splitting",
      detail: "react-window tables, lazy loading, and memoization for large datasets.",
      year: "2022",
    },
  ],
  process: [
    {
      step: "01",
      title: "THE IDEA",
      text: "Clarify product goals, users, and the surfaces that matter most.",
    },
    {
      step: "02",
      title: "ARCHITECTURE",
      text: "Component boundaries, state strategy, and API contracts before code spreads.",
    },
    {
      step: "03",
      title: "BUILD",
      text: "Ship reusable React/Next modules with TypeScript and clean hooks.",
    },
    {
      step: "04",
      title: "POLISH",
      text: "Performance passes — splitting, virtualization, loading and error states.",
    },
    {
      step: "05",
      title: "SHIP",
      text: "Tests with Jest/RTL, reviews, and release-ready quality in monorepos.",
    },
  ],
  toolkit: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Redux",
    "Redux-Saga",
    "GraphQL",
    "Tailwind",
    "MUI",
    "Ant Design",
    "Jest",
    "AWS",
    "Node.js",
  ],
  education: {
    degree: "Master of Computer Applications (MCA)",
    school: "J.C. Bose University of Science and Technology, YMCA",
    place: "Faridabad, Haryana",
    period: "2019 – 2022",
  },
  experience: [
    {
      role: "Software Engineer",
      company: "Datopic Technologies",
      place: "Noida, Uttar Pradesh",
      period: "Feb 2024 – Present",
      points: [
        "Scalable enterprise apps with React.js, Next.js, and TypeScript.",
        "Content publishing workflows for blogs, whitepapers, and case studies.",
        "GraphQL APIs, Redux/Saga/Context state, Jest & RTL testing.",
      ],
    },
    {
      role: "Software Development Engineer I",
      company: "IDC Technologies",
      place: "Noida, Uttar Pradesh",
      period: "Mar 2022 – Jun 2023",
      points: [
        "Enterprise banking and recruitment apps with React and TypeScript.",
        "Auth flows, REST APIs, and Firebase SMS OTP verification.",
        "Code splitting, lazy loading, and table virtualization for large data.",
      ],
    },
  ],
  wins: [
    { label: "Datopic", note: "Web + HR + Marketing" },
    { label: "Nuestack", note: "Marketing product UI" },
    { label: "Craft Silicon", note: "Loan Origination" },
    { label: "RCFL / Kisan Manch", note: "Admin portal" },
  ],
  quote:
    "Accountable for scalable, high-performance, and responsive web applications — from GraphQL data fetching to release quality.",
};

export type ProjectFilter = (typeof site.filters)[number];
