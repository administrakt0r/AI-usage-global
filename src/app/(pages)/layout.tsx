import type { ReactNode } from "react";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import type { NavigationSection } from "@/components/blocks/menu-navigation";

const navigationData: NavigationSection[] = [
  {
    title: "Home",
    href: "/#home",
  },
  {
    title: "Latest",
    href: "/#categories",
  },
  {
    title: "About",
    href: "/about",
  },
];

const PagesLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground absolute top-4 left-4 z-[100] -translate-y-20 rounded-md px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header navigationData={navigationData} />
      <main id="main-content" tabIndex={-1} className="flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PagesLayout;