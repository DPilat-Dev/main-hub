import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Next.js <Link> renders a plain anchor in tests.
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// usePathname / useRouter stubs for client components under test.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
