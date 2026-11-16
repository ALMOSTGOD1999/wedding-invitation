export const invitation = {
  hosts: "Mr. Rajat Mukherjee & Mrs. Uma Mukherjee",
  hostsBn: "শ্রী রজত মুখার্জি ও শ্রীমতী উমা মুখার্জি",
  event: {
    date: "2026-12-15",
    dateLabel: "Tuesday, 15 December, 2026",
    dateLabelBn: "১৫ই ডিসেবর, ২০২৬, মঙ্গলবার",
    startsAt: "2026-12-15T19:30:00+05:30",
    timeLabel: "7.30 pm followed by dinner",
    timeLabelBn: "সন্ধ্যা ৭টা ৩০ মিনিট",
    venue: "SANDHIKHHAN",
    venueBn: "সন্ধিক্ষণ",
    city: "Katwa",
    cityBn: "কাটোয়া",
    mapUrl: "https://www.google.com/maps?q=23.6405274,88.1342149&z=17&hl=en",
    contactNumbers: ["8617008081", "8926439491", "8926828468"],
    blessingOnly: true,
  },
  groom: {
    side: "Groom",
    name: "Mr. Rahul Mukherjee",
    nameBn: "রাহুল মুখার্জি",
    father: "Mr. Rajat Kanti Mukherjee",
    fatherBn: "শ্রী রজত কান্তি মুখার্জি",
    mother: "Mrs. Uma Mukherjee",
    motherBn: "শ্রীমতী উমা মুখার্জি",
    address:
      "Shree Durga Pally, Mill Math, Nandalal Basu Road, Katwa, Purba Bardhaman, West Bengal.",
    addressBn: "শ্রীদুর্গাপল্লী, মিল মাঠ, নন্দলাল বসু রোড, কটোয়া, পূর্ব বর্ধমান, পশ্চিমবঙ্গ।",
  },
  bride: {
    side: "Bride",
    name: "Ms. Soumi Ghosh",
    nameBn: "সৌমি ঘোষ",
    father: "Late Mr. Naresh Chandra Ghosh",
    fatherBn: "স্বর্গীয় শ্রী নরেশ চন্দ্র ঘোষ",
    mother: "Mrs. Indra Ghosh",
    motherBn: "শ্রীমতী ইন্দ্রা ঘোষ",
    address: "Saheb Bagan, Katwa, Purba Bardhaman, West Bengal.",
    addressBn: "সাহেব বাগান, কটোয়া, পূর্ব বর্ধমান, পশ্চিমবঙ্গ।",
  },
} as const;

export const invitationChapters = [
  {
    id: "welcome",
    title: "Wedding date & reception",
    titleBn: "বিবাহের তারিখ ও গ্রহণ",
    kicker: "A JOYOUS OCCASION",
    kickerBn: "আনন্দের সন্ধ্যা",
  },
  {
    id: "families",
    title: "Meet the families",
    titleBn: "পরিবারের পরিচয়",
    kicker: "FAMILY LINEAGE & INTRODUCTION",
    kickerBn: "পারিবারিক পরিচয়",
  },
  {
    id: "ceremony",
    title: "Reception details",
    titleBn: "গ্রহণ অনুষ্ঠানের বিবরণ",
    kicker: "THE CELEBRATION",
    kickerBn: "উৎসব অনুষ্ঠান",
  },
  {
    id: "venue",
    title: "Venue & directions",
    titleBn: "স্থান ও দিকনির্দেশ",
    kicker: "VENUE & DIRECTIONS",
    kickerBn: "স্থান ও দিকনির্দেশ",
  },
  {
    id: "letter",
    title: "Formal invitation",
    titleBn: "আনুষ্ঠানিক আমন্ত্রণ",
    kicker: "A FORMAL INVITATION",
    kickerBn: "আনুষ্ঠানিক আমন্ত্রণ",
  },
  {
    id: "closing",
    title: "Blessings & regards",
    titleBn: "আশীর্বাদ ও শুভেচ্ছা",
    kicker: "WITH LOVE FROM OUR FAMILIES",
    kickerBn: "আমাদের পরিবারের স্নেহ নিয়ে",
  },
] as const;

export function getGoogleCalendarUrl() {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", "Rahul & Soumi — Wedding Reception");
  url.searchParams.set("dates", "20261215/20261216");
  url.searchParams.set(
    "details",
    `Reception begins at ${invitation.event.timeLabel}. Blessing only.`,
  );
  url.searchParams.set("location", `${invitation.event.venue}, ${invitation.event.city}`);
  return url.toString();
}
