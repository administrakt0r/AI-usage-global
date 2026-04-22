"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TocGroup {
  main: TocItem;
  subs: TocItem[];
}

interface DynamicTocProps {
  contentContainerId?: string;
}

interface TocItemButtonProps {
  id: string;
  title: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const normalizeHeadingId = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export const useDynamicToc = (contentContainerId: string = "content") => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const extractHeadings = () => {
      const container = document.getElementById(contentContainerId);

      if (!container) return [];

      const headings = container.querySelectorAll("h2, h3");
      const items: TocItem[] = [];

      headings.forEach((heading) => {
        const element = heading as HTMLElement;
        const title = element.textContent?.trim();

        if (!title) return;

        let id = element.id;

        if (!id) {
          id = normalizeHeadingId(title);
          element.id = id;
        }

        const level = element.tagName === "H2" ? 2 : 3;

        items.push({ id, title, level });
      });

      return items;
    };

    const timer = setTimeout(() => {
      const items = extractHeadings();

      setTocItems(items);

      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [contentContainerId]);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const container = document.getElementById(contentContainerId);

    if (container) {
      const headings = container.querySelectorAll("h2, h3");

      headings.forEach((heading) => observer.observe(heading));
    }

    return () => observer.disconnect();
  }, [contentContainerId, tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return { tocItems, activeId, handleClick };
};

export const groupTocItems = (tocItems: TocItem[]): TocGroup[] => {
  const groupedItems: TocGroup[] = [];
  let currentGroup: TocGroup | null = null;

  tocItems.forEach((item) => {
    if (item.level === 2) {
      if (currentGroup) {
        groupedItems.push(currentGroup);
      }

      currentGroup = { main: item, subs: [] };

      return;
    }

    if (item.level === 3 && currentGroup) {
      currentGroup.subs.push(item);
    }
  });

  if (currentGroup) {
    groupedItems.push(currentGroup);
  }

  return groupedItems;
};

const TocItemButton = ({
  id,
  title,
  isActive,
  onClick,
}: TocItemButtonProps) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className={`flex items-start gap-2 text-left transition-colors ${
      isActive
        ? "font-medium text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <span
      className={`mt-2.5 inline-block h-0.5 w-3 shrink-0 transition-colors ${
        isActive ? "bg-primary" : "bg-primary/40"
      }`}
    />
    <span>{title}</span>
  </button>
);

export const DynamicToc = ({
  contentContainerId = "content",
}: DynamicTocProps) => {
  const { tocItems, activeId, handleClick } = useDynamicToc(contentContainerId);

  if (tocItems.length === 0) {
    return null;
  }

  const groupedItems = groupTocItems(tocItems);

  return (
    <div className="sticky top-24">
      <h3 className="mb-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-blue">
        Sadržaj objave
      </h3>
      <nav>
        <ul className="space-y-3">
          {groupedItems.map((group, groupIndex) => (
            <li key={`toc-group-${group.main.id}-${groupIndex}`}>
              <TocItemButton
                id={group.main.id}
                title={group.main.title}
                isActive={activeId === group.main.id}
                onClick={handleClick}
              />

              {group.subs.length > 0 ? (
                <ul className="mt-3 ml-5 space-y-3">
                  {group.subs.map((subtitle, subIndex) => (
                    <li key={`toc-sub-${subtitle.id}-${groupIndex}-${subIndex}`}>
                      <TocItemButton
                        id={subtitle.id}
                        title={subtitle.title}
                        isActive={activeId === subtitle.id}
                        onClick={handleClick}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
