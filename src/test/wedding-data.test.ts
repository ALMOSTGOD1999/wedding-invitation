import { describe, expect, it } from "vitest";

import { getGoogleCalendarUrl, invitation, invitationChapters } from "@/lib/wedding-data";

describe("wedding invitation details", () => {
  it("uses the supplied reception date, time, venue, and blessing-only note", () => {
    expect(invitation.event.dateLabel).toBe("Tuesday, 15 December, 2026");
    expect(invitation.event.timeLabel).toBe("7.30 pm followed by dinner");
    expect(invitation.event.venue).toBe("SANDHIKHHAN");
    expect(invitation.event.city).toBe("Katwa");
    expect(invitation.event.blessingOnly).toBe(true);
  });

  it("keeps both families' supplied names, parents, and addresses", () => {
    expect(invitation.groom.name).toBe("Mr. Rahul Mukherjee");
    expect(invitation.groom.father).toBe("Mr. Rajat kanti Mukherjee");
    expect(invitation.groom.mother).toBe("Mrs. Uma Mukherjee");
    expect(invitation.groom.address).toBe(
      "Shree Durga Pally, Mill Math, Nandalal Basu Road, Katwa, Purba Bardhaman, West Bengal.",
    );
    expect(invitation.bride.name).toBe("Ms. Soumi Ghosh");
    expect(invitation.bride.father).toBe("Late Mr. Naresh Chandra Ghosh");
    expect(invitation.bride.mother).toBe("Mrs. Indra Ghosh");
    expect(invitation.bride.address).toBe("Saheb Bagan, Katwa, Purba Bardhaman, West Bengal.");
  });

  it("includes all six invitation chapters", () => {
    expect(invitationChapters).toHaveLength(6);
  });

  it("uses the supplied venue map and contact numbers", () => {
    expect(invitation.event.mapUrl).toBe(
      "https://www.google.com/maps?q=23.6405274,88.1342149&z=17&hl=en",
    );
    expect(invitation.event.contactNumbers).toEqual(["8617008081", "8926439491", "8926828468"]);
  });

  it("creates a calendar entry for the supplied date, time, and venue without inventing an end time", () => {
    const calendarUrl = new URL(getGoogleCalendarUrl());
    expect(calendarUrl.searchParams.get("dates")).toBe("20261215/20261216");
    expect(calendarUrl.searchParams.get("details")).toContain("7.30 pm followed by dinner");
    expect(calendarUrl.searchParams.get("location")).toBe("SANDHIKHHAN, Katwa");
  });
});
