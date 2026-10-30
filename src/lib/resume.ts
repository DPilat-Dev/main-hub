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
    "Software Engineer with nearly 8 years building .NET backend services, APIs, payment and tax integrations, and serverless data pipelines for revenue-critical SaaS platforms. I consolidate legacy systems into shared services, build privacy compliance into data pipelines, and improve reliability through CI/CD, structured logging, and safe deployment practices.",

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
        "Designed and built a centralized tax service integrating the Avalara API, replacing flat tax table lookups across 26 websites with one shared service.",
        "Built a company-wide privacy compliance service that checks datasets and pipelines against California Delete Act (DROP) requests and excludes matching individuals.",
        "Migrated 10 websites from CyberSource to Stripe with no payment downtime.",
        "Architected and deployed backend services and APIs for a consolidated platform, replacing 6 legacy applications.",
        "Modernized 3 legacy ETL pipelines from a proprietary C++ DLL and batch file system to event-triggered serverless functions on AWS Lambda with Python, improving processing speed 1.5x.",
        "Built a geospatial tool that generates ZIP code and carrier route polygons from lat/lon lists, replacing a legacy executable with a C# API hosted on AWS and called from Lambda, cutting that ETL stage from 3 days to 12–24 hours.",
        "Manage 86 websites and applications across C#, PHP/Laravel, and ColdFusion, plus 16 legacy ETL pipelines, supporting a $40M revenue stream.",
        "Built GitHub Actions CI/CD pipelines and added Serilog structured logging and runbooks, reducing manual release steps and shortening MTTR.",
        "Wrote versioned SQL migration and rollback scripts with verified backups to protect production data.",
        "Wrote unit and integration tests and refactored legacy C# modules into testable libraries.",
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
      skills: ["C#", "Python", "TypeScript", "JavaScript", "Java", "SQL", "HTML/CSS"],
    },
    {
      label: "Frameworks & Runtime",
      skills: [".NET", "ASP.NET", "Entity Framework", "REST APIs", "PHP/Laravel", "ColdFusion", "React", "Next.js", "Node.js"],
    },
    {
      label: "Data",
      skills: ["SQL Server", "PostgreSQL", "NoSQL", "ETL / Data Engineering", "Prisma"],
    },
    {
      label: "Cloud & DevOps",
      skills: ["AWS", "AWS Lambda", "Serverless", "Azure", "Docker", "CI/CD", "GitHub Actions", "Microservices"],
    },
    {
      label: "Practices",
      skills: ["Structured Logging", "Testing", "Runbooks", "Git / GitHub", "Serilog", "Hangfire", "Stripe", "Avalara"],
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
