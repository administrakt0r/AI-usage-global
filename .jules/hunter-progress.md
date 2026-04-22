# Hunter Progress Tracker

## Fixed
- [2026-03-29] [src/components/table-of-contents/dynamic-toc.tsx] Fixed duplicate component definition by separating useDynamicToc hook
- [2026-03-29] [src/components/blocks/blog-component/blog-component.tsx] Removed unused components: BlogFilters, BlogHeader, BlogEmptyState, BlogPagination
- [2026-03-29] [src/app/(pages)/page.tsx] Removed unused SITE_SHORT_DESCRIPTION import
- [2026-03-29] [src/hooks/use-active-section.ts] Fixed missing activeSection dependency in useEffect
- [2026-03-29] [src/lib/blog.test.ts] Removed unused mockPost5 variable
- [2026-03-29] [scripts/load-blog-data.mjs] Fixed line padding ESLint errors

## Known Issues

## False Positives
