// Structured resume content — the single source of truth for the /resume page
// and the home hero. Edit here to update your resume across the site.

export type ExperienceItem = {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
};

export type SkillGroup = {
  label: string;
  skills: string[];
};

export type EducationItem = {
  school: string;
  credential: string;
  location: string;
  date: string;
  detail?: string;
};

export const resume = {
  name: "David Pilat",
  title: "Software Engineer",
  summary:
    "Software Engineer with 8+ years building and stabilizing SaaS platforms that protect revenue and speed delivery. I reduce production incidents and shorten MTTR through structured logging, runbooks, and automated CI/CD, and I consolidate legacy systems into maintainable, well-tested services. Focused on resilient deployments and faster feature delivery.",

  experience: [
    {
      company: "Deep Sync",
      title: "Software Engineer",
      location: "Redmond, WA · Hybrid",
      start: "Apr 2024",
      end: "Present",
      summary:
        "Stabilizing and modernizing revenue-critical SaaS while consolidating legacy applications into a single maintainable platform.",
      highlights: [
        "Maintain legacy applications protecting a $40M revenue stream while cutting production incidents.",
        "Architected, built, and deployed back-end components for the consolidated site to support scalable APIs, improve performance, and replace legacy applications.",
        "Migrated a legacy website into one consolidated site to make maintenance and deployments consistent.",
        "Built GitHub Actions pipelines that run unit tests, build, and publish artifacts on PRs — improving CI reliability and reducing manual release steps and errors.",
        "Implemented structured logging with Serilog to speed debugging and incident resolution.",
        "Documented legacy behavior and authored runbooks to shorten troubleshooting and lower MTTR.",
        "Wrote versioned SQL migration and rollback scripts with verified backups to protect production data during deploys.",
        "Maintained ETL pipelines and tuned SQL jobs to stabilize nightly data loads for analytics.",
        "Refactored legacy C# modules into smaller libraries to simplify testing and reduce merge conflicts.",
        "Authored onboarding docs and Docker Compose setups to cut new-hire environment issues and ramp time.",
      ],
    },
    {
      company: "Bizvalet",
      title: "Fullstack Software Engineer",
      location: "Bellevue, WA · Hybrid",
      start: "Sep 2018",
      end: "Nov 2023",
      summary:
        "Built customer-facing features and platform capabilities for maid-service SaaS across the Seattle area.",
      highlights: [
        "Delivered new features with C#, ASP.NET, and Entity Framework, including drip email and blogging.",
        "Implemented advanced drip email with Hangfire, increasing user retention by 10%.",
        "Designed a robust blogging platform with an admin interface and WYSIWYG editor.",
        "Built recurring orders with Hangfire, enhancing customer scheduling flexibility.",
        "Integrated Google Calendar, Geocoding, and Stripe APIs for improved functionality and transparency.",
        "Created an embeddable, cross-domain booking form in JavaScript for versatile site integration.",
        "Executed SQL database design and optimization strategies for improved efficiency.",
      ],
    },
    {
      company: "Bizvalet",
      title: "Frontend Developer Intern",
      location: "Bellevue, WA · Hybrid",
      start: "Jun 2018",
      end: "Aug 2018",
      summary:
        "Built user-friendly web applications to enhance customer experience for Bizvalet's maid services.",
      highlights: [
        "Developed responsive web features using HTML, CSS, and JavaScript.",
        "Collaborated on features to empower maid services around the Seattle area.",
      ],
    },
  ] satisfies ExperienceItem[],

  skills: [
    {
      label: "Languages",
      skills: ["C#", "TypeScript", "JavaScript", "Java", "SQL", "HTML/CSS"],
    },
    {
      label: "Frameworks & Runtime",
      skills: [".NET", "ASP.NET", "Entity Framework", "React", "Next.js", "Node.js"],
    },
    {
      label: "Data",
      skills: ["SQL Server", "PostgreSQL", "NoSQL", "ETL / Data Engineering", "Prisma"],
    },
    {
      label: "Cloud & DevOps",
      skills: ["Azure", "AWS", "Docker", "CI/CD", "GitHub Actions", "Microservices"],
    },
    {
      label: "Practices",
      skills: ["Structured Logging", "Testing", "Runbooks", "Git / GitHub", "Serilog", "Hangfire"],
    },
  ] satisfies SkillGroup[],

  education: [
    {
      school: "Edmonds College",
      credential: "Associate of Science in Computer Science",
      location: "Lynnwood, WA",
      date: "Jun 2019",
      detail:
        "Relevant coursework: Software Engineering, Java series, C/C++ series, Physics series, Calculus, Statistics.",
    },
  ] satisfies EducationItem[],
} as const;
