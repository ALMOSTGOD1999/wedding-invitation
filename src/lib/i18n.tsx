import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";

type Dict = Record<string, string>;

const en: Dict = {
  "lang.switchAria": "Switch language",
  "lang.name": "বাংলা",

  "couple.first": "Rahul",
  "couple.last": "Soumi",
  "couple.amp": "&",
  "couple.full": "Rahul & Soumi",

  "blessing.only": "❖ \u00A0 BLESSING ONLY \u00A0 ❖",

  "cover.invocation": "✧ \u00A0॥ Om Sri Prajapataye Namah ॥ \u00A0✧",
  "cover.title": "Grand Wedding Reception\nInvitation",
  "cover.subtitle": "A celebration of timeless love & traditions",
  "cover.envelopeAria": "Open your invitation",
  "cover.letterSalutation": "॥ Reception Invitation ॥",
  "cover.open": "Open Your Invitation",
  "cover.skip": "Skip to invitation",

  "toolbar.aria": "Invitation controls",
  "toolbar.musicOn": "Music On",
  "toolbar.musicOff": "Music",
  "toolbar.turnOff": "Turn music off",
  "toolbar.turnOn": "Turn music on",
  "toolbar.playTitle": "Play the invitation music",
  "toolbar.cover": "Cover",
  "toolbar.pages": "Pages",
  "toolbar.pagesAria": "Invitation pages",
  "menu.eyebrow": "THE INVITATION",

  "nav.prev": "Prev",
  "nav.next": "Next",
  "nav.prevAria": "Previous page",
  "nav.nextAria": "Next page",
  "nav.page": "Page {current} / {total}",
  "nav.aria": "Invitation page navigation",

  "welcome.title": "A day of joy,\na lifetime of love",
  "welcome.lede": "Together with their families",
  "welcome.hostRequest":
    "request the honor of your presence at the auspicious occasion of the wedding reception of their son",
  "welcome.dateLabel": "RECEPTION DATE",
  "welcome.reception": "RECEPTION",
  "welcome.venue": "VENUE",

  "countdown.aria": "Countdown to the reception",
  "countdown.title": "COUNTDOWN TO THE CELEBRATION",
  "countdown.days": "Days",
  "countdown.hours": "Hours",
  "countdown.mins": "Mins",
  "countdown.secs": "Secs",

  "families.eyebrow": "FAMILY LINEAGE & INTRODUCTION",
  "families.title": "The Bride & Groom",
  "families.subtitle": "The sacred union of two loving souls and two esteemed families",
  "families.groom": "Groom",
  "families.bride": "Bride",
  "families.father": "Father",
  "families.mother": "Mother",
  "families.address": "Address",
  "families.portraitAlt": "{label} portrait",
  "families.blessing": "We warmly welcome you to share in the joy of this auspicious occasion.",

  "ceremony.eyebrow": "THE CELEBRATION",
  "ceremony.title": "Reception details",
  "ceremony.subtitle": "We look forward to celebrating together",
  "ceremony.receptionLabel": "WEDDING RECEPTION",
  "ceremony.addCalendar": "Add to Google Calendar",

  "venue.eyebrow": "VENUE & DIRECTIONS",
  "venue.title": "We look forward to welcoming you",
  "venue.subtitle": "Join us for an evening of celebration",
  "venue.venueLabel": "THE RECEPTION VENUE",
  "venue.mapLink": "Open map directions",
  "venue.contactsLabel": "GUEST CONTACTS",
  "venue.contactsAria": "Venue contact numbers",

  "letter.eyebrow": "A FORMAL INVITATION",
  "letter.title": "Dear family & friends",
  "letter.subtitle": "With warm regards from the hosts",
  "letter.body1":
    "{hosts} request the honor of your presence at the auspicious occasion of the wedding reception of their son,",
  "letter.body3": "on {date} at {time}, at {venue}, {city}.",
  "letter.body4":
    "Your gracious presence and heartfelt blessings will make this joyous celebration truly memorable.",
  "letter.signoff": "With warm regards,",
  "letter.signoffName": "Rajat & Uma Mukherjee",

  "closing.eyebrow": "WITH LOVE FROM OUR FAMILIES",
  "closing.title": "Your blessings\nare our greatest gift",
  "closing.copy":
    "We would be honoured to have your presence and blessings as Rahul and Soumi begin this beautiful new chapter.",
  "closing.return": "Return to the invitation",
};

const bn: Dict = {
  "lang.switchAria": "ভাষা বদলান",
  "lang.name": "English",

  "couple.first": "রাহুল",
  "couple.last": "সৌমি",
  "couple.amp": "ও",
  "couple.full": "রাহুল ও সৌমি",

  "blessing.only": "❖ \u00A0 কেবল আশীর্বাদ \u00A0 ❖",

  "cover.invocation": "✧ \u00A0॥ Om Sri Prajapataye Namah ॥ \u00A0✧",
  "cover.title": "শুভ বিবাহ গ্রহণ\nআমন্ত্রণপত্র",
  "cover.subtitle": "অক্ষুণ্ণ স্নেহ ও চিরন্তন ঐতিহ্যের উৎসব",
  "cover.envelopeAria": "আপনার আমন্ত্রণ খুলুন",
  "cover.letterSalutation": "॥ গ্রহণ অনুষ্ঠানের আমন্ত্রণ ॥",
  "cover.open": "আপনার আমন্ত্রণ খুলুন",
  "cover.skip": "সরাসরি আমন্ত্রণে যান",

  "toolbar.aria": "আমন্ত্রণ নিয়ন্ত্রণ",
  "toolbar.musicOn": "সংগীত চালু",
  "toolbar.musicOff": "সংগীত",
  "toolbar.turnOff": "সংগীত বন্ধকরুন",
  "toolbar.turnOn": "সংগীত চালু করুন",
  "toolbar.playTitle": "আমন্ত্রণের সংগীত বাজান",
  "toolbar.cover": "প্রচ্ছদ",
  "toolbar.pages": "পৃষ্ঠা",
  "toolbar.pagesAria": "আমন্ত্রণের পৃষ্ঠাসমূহ",
  "menu.eyebrow": "আমন্ত্রণপত্র",

  "nav.prev": "আগের",
  "nav.next": "পরের",
  "nav.prevAria": "আগের পৃষ্ঠা",
  "nav.nextAria": "পরের পৃষ্ঠা",
  "nav.page": "পৃষ্ঠা {current} / {total}",
  "nav.aria": "আমন্ত্রণ পৃষ্ঠা পরিক্রমা",

  "welcome.title": "একদিনের আনন্দ,\nজীবনজুড়ে প্রেমের গাথা",
  "welcome.lede": "তাঁদের পরিবারের সঙ্গে মিলে ",
  "welcome.hostRequest":
    "তাঁদের পুত্রের বিবাহ গ্রহণ অনুষ্ঠানে আপনার পবিত্র উপস্থিতি বরণ করতে অনুরোধ করছেন",
  "welcome.dateLabel": "অনুষ্ঠানের তারিখ",
  "welcome.reception": "অনুষ্ঠান",
  "welcome.venue": "স্থান",

  "countdown.aria": "অনুষ্ঠান পর্যন্ত সময় গণনা",
  "countdown.title": "অনুষ্ঠানের সময় গণনা",
  "countdown.days": "দিন",
  "countdown.hours": "ঘণ্টা",
  "countdown.mins": "মিনিট",
  "countdown.secs": "সেকেন্ড",

  "families.eyebrow": "পারিবারিক পরিচয়",
  "families.title": "বর ও কনে",
  "families.subtitle": "দুই প্রিয় আত্মার পবিত্র মিলন, দুই মর্যাদাসম্পন্ন পরিবারের সংযোগ",
  "families.groom": "বর",
  "families.bride": "কনে",
  "families.father": "পিতা",
  "families.mother": "মাতা",
  "families.address": "ঠিকানা",
  "families.portraitAlt": "{label}র ছবি",
  "families.blessing": "পবিত্র এই আনন্দ-অনুষ্ঠানে অংশ নিতে আপনাকে আমরা আন্তরিকভাবে স্বাগত জানাই।",

  "ceremony.eyebrow": "উৎসব অনুষ্ঠান",
  "ceremony.title": "গ্রহণ অনুষ্ঠানের বিবরণ",
  "ceremony.subtitle": "আপনাদের সহিত উদ্‌যাপন করতে আমরা অপেক্ষা করছি",
  "ceremony.receptionLabel": "বিবাহ গ্রহণ অনুষ্ঠান",
  "ceremony.addCalendar": "গুগল ক্যালেন্ডারে যোগ করুন",

  "venue.eyebrow": "স্থান ও দিকনির্দেশ",
  "venue.title": "আপনাদের অভ্যর্থনা জানাতে আমরা অপেক্ষায়",
  "venue.subtitle": "উৎসবের সেই সন্ধ্যা আমাদের সঙ্গে কাটান",
  "venue.venueLabel": "অনুষ্ঠানের স্থান",
  "venue.mapLink": "মানচিত্রে পথ দেখুন",
  "venue.contactsLabel": "অতিথিদের যোগাযোগ",
  "venue.contactsAria": "যোগাযোগ নম্বর",

  "letter.eyebrow": "আনুষ্ঠানিক আমন্ত্রণ",
  "letter.title": "প্রিয় পরিবার ও বন্ধুবান্ধব",
  "letter.subtitle": "আমন্ত্রক পরিবারের হৃদয়কথা",
  "letter.body1":
    "{hosts} তাঁদের পুত্রের বিবাহ গ্রহণ অনুষ্ঠানে আপনার পবিত্র উপস্থিতি বরণ করতে অনুরোধ করছেন,",
  "letter.body3": "{date} তারিখে {time}, {venue}, {city}-এ।",
  "letter.body4":
    "আপনার সুন্দর উপস্থিতি ও হৃদয় থেকে নির্গত আশীর্বাদ এই আনন্দময় উৎসবকে সত্যিকারভাবে স্মরণীয় করে তুলবে।",
  "letter.signoff": "সান্নিধ্য নিয়ে,",
  "letter.signoffName": "রজত ও উমা মুখার্জি",

  "closing.eyebrow": "আমাদের পরিবারের স্নেহ নিয়ে",
  "closing.title": "আপনার আশীর্বাদই\nআমাদের সবচেয়ে বড় দান",
  "closing.copy":
    "রাহুল ও সৌমির এই সুন্দর নতুন অধ্যায় শুরু হলে আপনাদের উপস্থিতি ও আশীর্বাদ পেয়ে আমরা সম্মানিত হব।",
  "closing.return": "আমন্ত্রণে ফিরে যান",
};

const STORAGE_KEY = "invitation-lang";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  pick: <T>(enValue: T, bnValue: T) => T;
}

const LangContext = createContext<LangContextValue | null>(null);

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "bn" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((current) => (current === "en" ? "bn" : "en"));
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const table = lang === "bn" ? bn : en;
      const template = table[key] ?? en[key] ?? key;
      return interpolate(template, params);
    },
    [lang],
  );

  const pick = useCallback(
    <T,>(enValue: T, bnValue: T) => (lang === "bn" ? bnValue : enValue),
    [lang],
  );

  const value = { lang, setLang, toggleLang, t, pick };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within LangProvider");
  return context;
}

export function useT() {
  return useLang().t;
}
