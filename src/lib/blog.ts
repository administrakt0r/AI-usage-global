export type BlogCategory = "AI Usage";
export type BlogStats = {
  postCount: number;
  daysRunning: number;
};

export type BlogPost = {
  id: number;
  slug: string;
  contentSlug: string;
  title: string;
  description: string;
  imageUrl: string;
  socialImageUrl: string;
  imageAlt: string;
  publishedOn: string;
  publishedTime?: string;
  category: BlogCategory;
  author: string;
  avatarUrl: string;
  readTime: number;
  featured: boolean;
  keywords?: string[];
};

type PostDateSource = Pick<BlogPost, "publishedOn" | "publishedTime">;
type SortablePost = Pick<BlogPost, "id" | "publishedOn" | "publishedTime">;
type PublishedDateSource = Pick<BlogPost, "publishedOn">;

const DEFAULT_MACHINE_TIME = "08:00";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const padTime = (value: number) => String(value).padStart(2, "0");

const parseDateParts = ({ publishedOn, publishedTime }: PostDateSource) => {
  const [year, month, day] = publishedOn.split("-").map(Number);

  const [hour, minute] = (publishedTime ?? DEFAULT_MACHINE_TIME)
    .split(":")
    .map(Number);

  return { year, month, day, hour, minute };
};

export const getPostMachineDate = (post: PostDateSource) => {
  const { year, month, day, hour, minute } = parseDateParts(post);

  return new Date(Date.UTC(year, month - 1, day, hour, minute));
};

export const getPostIsoDateTime = (post: PostDateSource) =>
  getPostMachineDate(post).toISOString();

export const getPostRssDate = (post: PostDateSource) =>
  getPostMachineDate(post).toUTCString();

export const formatDisplayDate = (publishedOn: string) => {
  const date = new Date(`${publishedOn}T00:00:00Z`);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const formatDisplayTime = (publishedTime?: string) => {
  if (!publishedTime) {
    return null;
  }

  const [hour, minute] = publishedTime.split(":").map(Number);
  const date = new Date(Date.UTC(2000, 0, 1, hour, minute));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

export const formatPostDisplayDate = (post: PostDateSource) =>
  formatDisplayDate(post.publishedOn);

export const formatPostDisplayDateTime = (post: PostDateSource) => {
  const displayDate = formatPostDisplayDate(post);
  const displayTime = formatDisplayTime(post.publishedTime);

  return displayTime ? `${displayDate} at ${displayTime}` : displayDate;
};

const parseCalendarDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  return { year, month, day };
};

const getFormatterDateParts = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
};

export const getCurrentDateInTimeZone = (
  timeZone: string,
  now = new Date(),
) => {
  const { year, month, day } = getFormatterDateParts(now, timeZone);

  return `${year}-${padTime(month)}-${padTime(day)}`;
};

export const getCalendarDayDifference = (
  startDate: string,
  endDate: string,
) => {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);

  return Math.floor(
    (Date.UTC(end.year, end.month - 1, end.day) -
      Date.UTC(start.year, start.month - 1, start.day)) /
      MS_PER_DAY,
  );
};

export const getFirstPublishedOn = (posts: PublishedDateSource[]) => {
  if (posts.length === 0) {
    return null;
  }

  return posts.reduce(
    (earliest, post) =>
      post.publishedOn < earliest ? post.publishedOn : earliest,
    posts[0].publishedOn,
  );
};

export const getBlogStats = (
  posts: PublishedDateSource[],
  options: { now?: Date; timeZone?: string } = {},
): BlogStats => {
  const { now = new Date(), timeZone = "America/New_York" } = options;
  const firstPublishedOn = getFirstPublishedOn(posts);

  return {
    postCount: posts.length,
    daysRunning: firstPublishedOn
      ? getCalendarDayDifference(
          firstPublishedOn,
          getCurrentDateInTimeZone(timeZone, now),
        )
      : 0,
  };
};

export const comparePostsByPublishedAt = (
  left: SortablePost,
  right: SortablePost,
) => {
  const timestampDelta =
    getPostMachineDate(right).getTime() - getPostMachineDate(left).getTime();

  if (timestampDelta !== 0) {
    return timestampDelta;
  }

  return right.id - left.id;
};