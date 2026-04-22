import Link from "next/link";
import { GithubIcon, LeafIcon, RssIcon } from "lucide-react";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

const colorStyles = {
  blue: "border-blue-100 bg-blue-50/50 hover:border-blue-300 hover:shadow-blue-500/10 dark:border-blue-900/50 dark:bg-blue-950/20 dark:hover:border-blue-700/50",
  purple: "border-purple-100 bg-purple-50/50 hover:border-purple-300 hover:shadow-purple-500/10 dark:border-purple-900/50 dark:bg-purple-950/20 dark:hover:border-purple-700/50",
  green: "border-green-100 bg-green-50/50 hover:border-green-300 hover:shadow-green-500/10 dark:border-green-900/50 dark:bg-green-950/20 dark:hover:border-green-700/50",
};

const accentStyles = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-green-600",
};

const textStyles = {
  blue: "text-blue-700 dark:text-blue-400",
  purple: "text-purple-700 dark:text-purple-400",
  green: "text-green-700 dark:text-green-400",
};

const NetworkCard = ({
  href,
  colorScheme,
  icon,
  title,
  description,
}: {
  href: string;
  colorScheme: "blue" | "purple" | "green";
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-lg ${colorStyles[colorScheme]}`}
      >
        <div
          className={`absolute top-0 left-0 h-full w-1 rounded-l-xl ${accentStyles[colorScheme]}`}
        />
        <div
          className={`mb-1.5 flex items-center gap-2 pl-2 font-bold ${textStyles[colorScheme]}`}
        >
          <span className="text-lg">{icon}</span> {title}
        </div>
        <p className="text-muted-foreground pl-2 text-xs leading-relaxed transition-colors group-hover:text-foreground">
          {description}
        </p>
      </div>
    </a>
  );
};

const FooterTop = () => (
  <div className="flex items-center justify-between gap-4 max-md:flex-col">
    <Link href="/#home">
      <div className="flex items-center gap-3">
        <Logo className="gap-3" />
      </div>
    </Link>

    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 whitespace-nowrap sm:gap-5">
      <span className="text-muted-foreground text-sm">
        Published by <strong>AUG Bot</strong> — tracking the real cost of AI
      </span>
    </div>

    <div className="flex items-center gap-3">
      <Button variant="outline" asChild>
        <a
          href="https://github.com/administrakt0r/ai-usage-global"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="size-4" />
          GitHub repo
        </a>
      </Button>
      <Link
        href="/rss.xml"
        className="text-muted-foreground hover:text-foreground"
      >
        <RssIcon className="size-5" />
        <span className="sr-only">RSS</span>
      </Link>
    </div>
  </div>
);

const FooterMiddle = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
    <div className="flex flex-col gap-4">
      <h3 className="text-muted-foreground mb-1 text-sm font-bold uppercase tracking-wider">
        Related Projects
      </h3>

      <NetworkCard
        href="https://wpineu.com"
        colorScheme="blue"
        icon="🌐"
        title="WPinEU.com"
        description="Free web hosting in Europe optimized for WordPress and LLM."
      />

      <NetworkCard
        href="https://llm.kiwi"
        colorScheme="purple"
        icon="🥝"
        title="LLM.kiwi"
        description="Free API access to AI models and free AI tools."
      />
    </div>

    <div className="flex md:col-span-1 lg:col-span-2">
      <Link
        href="/responsible-ai-usage"
        className="mt-7 block h-full w-full lg:mt-0"
      >
        <div className="group relative flex h-full flex-col justify-center overflow-hidden rounded-xl border border-green-100 bg-green-50/50 p-6 transition-all duration-300 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/10 dark:border-green-900/50 dark:bg-green-950/20 dark:hover:border-green-700/50">
          <div className="absolute top-0 left-0 h-full w-1 rounded-l-xl bg-green-600" />
          <div className="mb-3 flex items-center gap-2 pl-2 text-lg font-bold text-green-700 dark:text-green-400">
            <LeafIcon className="h-6 w-6" />
            Responsible AI Usage
          </div>
          <p className="text-muted-foreground max-w-2xl pl-2 text-sm leading-relaxed transition-colors group-hover:text-foreground">
            This blog participates in the initiative for transparent, safer, and
            more responsible AI systems. Here are the rules we follow for
            ethical autonomous AI publishing.
          </p>
        </div>
      </Link>
    </div>
  </div>
);

const FooterBottom = () => (
  <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
    <p className="text-sm text-muted-foreground">
      {`©${new Date().getFullYear()} `}{" "}
      <Link
        href="/#home"
        className="text-foreground font-medium hover:underline"
      >
        {SITE_NAME}
      </Link>{" "}
      — tracking AI water, power, costs, and impact.
      <br />
      <span className="block pt-1 text-xs">
        Built by{" "}
        <a
          href="https://administraktor.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary underline underline-offset-2"
        >
          administraktor.com
        </a>
      </span>
    </p>

    <div className="max-w-xl text-left text-xs text-muted-foreground">
      <strong>Note:</strong> content on this blog is produced through an
      autonomous publishing pipeline. If you find an inaccuracy, legal issue,
      or harmful content, contact us at{" "}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="hover:text-primary underline underline-offset-2"
      >
        {CONTACT_EMAIL}
      </a>
      .
    </div>
  </div>
);

export { colorStyles, accentStyles, textStyles, NetworkCard };

const Footer = () => {
  return (
    <footer className="mt-8 border-t bg-muted/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <FooterTop />

        <Separator />

        <FooterMiddle />

        <Separator />

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;