import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  getBlogStats,
  getCalendarDayDifference,
  getCurrentDateInTimeZone,
  getFirstPublishedOn,
  getPostMachineDate,
  getPostIsoDateTime,
  getPostRssDate,
  formatDisplayDate,
  formatDisplayTime,
  formatPostDisplayDate,
  formatPostDisplayDateTime,
  comparePostsByPublishedAt,
  type BlogPost,
} from "./blog";

describe("blog utility functions", () => {
  const mockPost1 = {
    id: 1,
    publishedOn: "2023-10-15",
    publishedTime: "14:30",
  } as BlogPost;

  const mockPost2 = {
    id: 2,
    publishedOn: "2023-10-15",
    publishedTime: "14:30",
  } as BlogPost;

  const mockPost3 = {
    id: 3,
    publishedOn: "2023-10-15",
  } as BlogPost;

  const mockPost4 = {
    id: 4,
    publishedOn: "2024-01-01",
    publishedTime: "08:00",
  } as BlogPost;

  describe("getPostMachineDate", () => {
    it("returns correct Date object with publishedTime", () => {
      const date = getPostMachineDate(mockPost1);

      assert.equal(
        date.getTime(),
        new Date(Date.UTC(2023, 9, 15, 14, 30)).getTime(),
      );
    });

    it("returns correct Date object with default time when publishedTime is missing", () => {
      const date = getPostMachineDate(mockPost3);

      assert.equal(
        date.getTime(),
        new Date(Date.UTC(2023, 9, 15, 8, 0)).getTime(),
      );
    });
  });

  describe("getPostIsoDateTime", () => {
    it("returns correct ISO string", () => {
      assert.equal(getPostIsoDateTime(mockPost1), "2023-10-15T14:30:00.000Z");
    });

    it("returns correct ISO string with default time", () => {
      assert.equal(getPostIsoDateTime(mockPost3), "2023-10-15T08:00:00.000Z");
    });
  });

  describe("getPostRssDate", () => {
    it("returns correct UTC string", () => {
      assert.equal(getPostRssDate(mockPost1), "Sun, 15 Oct 2023 14:30:00 GMT");
    });

    it("returns correct UTC string with default time", () => {
      assert.equal(getPostRssDate(mockPost3), "Sun, 15 Oct 2023 08:00:00 GMT");
    });
  });

  describe("formatDisplayDate", () => {
    it("formats date string in English long format", () => {
      assert.equal(formatDisplayDate("2023-10-15"), "October 15, 2023");
      assert.equal(formatDisplayDate("2024-01-05"), "January 5, 2024");
    });
  });

  describe("formatDisplayTime", () => {
    it("formats time string in 12-hour format", () => {
      assert.equal(formatDisplayTime("14:30"), "2:30 PM");
      assert.equal(formatDisplayTime("9:05"), "9:05 AM");
    });

    it("returns null if no time string provided", () => {
      assert.equal(formatDisplayTime(undefined), null);
    });
  });

  describe("formatPostDisplayDate", () => {
    it("formats post publishedOn correctly", () => {
      assert.equal(formatPostDisplayDate(mockPost1), "October 15, 2023");
    });
  });

  describe("formatPostDisplayDateTime", () => {
    it("formats post date and time correctly", () => {
      assert.equal(formatPostDisplayDateTime(mockPost1), "October 15, 2023 at 2:30 PM");
    });

    it("formats post date correctly when time is missing", () => {
      assert.equal(formatPostDisplayDateTime(mockPost3), "October 15, 2023");
    });
  });

  describe("comparePostsByPublishedAt", () => {
    it("sorts correctly based on timestamp delta", () => {
      assert.ok(comparePostsByPublishedAt(mockPost1, mockPost4) > 0);
      assert.ok(comparePostsByPublishedAt(mockPost4, mockPost1) < 0);
    });

    it("falls back to sort by id (descending) when timestamps are identical", () => {
      assert.ok(comparePostsByPublishedAt(mockPost1, mockPost2) > 0);
      assert.ok(comparePostsByPublishedAt(mockPost2, mockPost1) < 0);
    });

    it("sorts posts with default time correctly", () => {
      assert.ok(comparePostsByPublishedAt(mockPost3, mockPost1) > 0);
      assert.ok(comparePostsByPublishedAt(mockPost1, mockPost3) < 0);
    });
  });

  describe("getCurrentDateInTimeZone", () => {
    it("returns the current calendar date for America/New_York", () => {
      assert.equal(
        getCurrentDateInTimeZone(
          "America/New_York",
          new Date("2026-04-13T22:30:00.000Z"),
        ),
        "2026-04-13",
      );
    });
  });

  describe("getCalendarDayDifference", () => {
    it("calculates exclusive calendar day difference", () => {
      assert.equal(getCalendarDayDifference("2026-03-28", "2026-04-14"), 17);
    });
  });

  describe("getFirstPublishedOn", () => {
    it("returns the earliest published date", () => {
      assert.equal(
        getFirstPublishedOn([
          { publishedOn: "2026-04-14" },
          { publishedOn: "2026-03-28" },
          { publishedOn: "2026-04-01" },
        ]),
        "2026-03-28",
      );
    });

    it("returns null when the list is empty", () => {
      assert.equal(getFirstPublishedOn([]), null);
    });
  });

  describe("getBlogStats", () => {
    it("returns post count and running days for the homepage stats line", () => {
      assert.deepEqual(
        getBlogStats(
          [
            { publishedOn: "2026-04-14" },
            { publishedOn: "2026-03-28" },
            { publishedOn: "2026-04-01" },
          ],
          {
            now: new Date("2026-04-14T10:00:00.000Z"),
            timeZone: "America/New_York",
          },
        ),
        {
          postCount: 3,
          daysRunning: 17,
        },
      );
    });
  });
});