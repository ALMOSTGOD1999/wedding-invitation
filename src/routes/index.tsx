import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Phone,
  Heart,
  Languages,
  Mail,
  MapPin,
  Music2,
  Navigation,
  Sparkles,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import bridePlaceholder from "@/assets/bride-placeholder.png";
import groomPlaceholder from "@/assets/groom-placeholder.png";
import { LangProvider, useLang, useT } from "@/lib/i18n";
import { getGoogleCalendarUrl, invitation, invitationChapters } from "@/lib/wedding-data";

// Served from public/ so the invitation music plays in every environment —
// the original asset-proxy route only resolves on the hosted preview.
const MUSIC_URL = "/wedding-invitation-song.mp3";

// Canonical domain for all SEO tags (canonical, Open Graph, structured data).
const SITE_URL = "https://rahul-weds-soumi.site";

// Schema.org WeddingEvent so search engines understand the event (date, venue,
// people) and can surface it for name searches like "rahul soumi wedding".
const weddingEventJsonLd = {
  "@context": "https://schema.org",
  "@type": "WeddingEvent",
  name: "Rahul & Soumi Wedding Reception",
  description:
    "Wedding reception celebration of Rahul Mukherjee and Soumi Ghosh on 15 December 2026 at Sandhikkhan, Katwa, West Bengal. Blessing only.",
  startDate: "2026-12-15T19:30:00+05:30",
  alternateName: "rahulsoumi wedding",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "SANDHIKHHAN",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Katwa",
      addressRegion: "West Bengal",
      addressCountry: "IN",
    },
  },
  organizer: { "@type": "Person", name: "Rajat Mukherjee" },
  about: [
    { "@type": "Person", name: "Rahul Mukherjee", alternateName: "Rahul" },
    { "@type": "Person", name: "Soumi Ghosh", alternateName: "Soumi" },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rahul & Soumi Wedding | Reception Invitation — 15 Dec 2026, Katwa" },
      {
        name: "description",
        content:
          "The wedding reception of Rahul Mukherjee & Soumi Ghosh —15 December2026 at Sandhikkhan, Katwa, West Bengal. Blessing only. Venue, time and directions.",
      },
      {
        name: "keywords",
        content:
          "rahul soumi wedding, rahul soumi, rahulsoumi, rahulsoumi wedding, rahul-soumi, rahul weds soumi, rahul mukherjee soumi ghosh, wedding reception katwa, wedding invitation, bengali wedding reception",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#6b1216" },
      { property: "og:title", content: "Rahul & Soumi Wedding Reception —15 December2026" },
      {
        property: "og:description",
        content:
          "Join Rahul and Soumi's wedding reception in Katwa on15 December2026. Blessing only.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:site_name", content: "Rahul Weds Soumi" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rahul & Soumi Wedding Reception" },
      {
        name: "twitter:description",
        content: "Wedding reception of Rahul & Soumi —15 December2026, Katwa. Blessing only.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(weddingEventJsonLd),
        children: JSON.stringify(weddingEventJsonLd),
      },
    ],
  }),
  component: WeddingInvitation,
});

type ChapterId = (typeof invitationChapters)[number]["id"];

export function WeddingInvitation() {
  return (
    <LangProvider>
      <InvitationShell />
    </LangProvider>
  );
}

function InvitationShell() {
  const { toggleLang, t, pick } = useLang();
  const [opened, setOpened] = useState(false);
  const [envelopeAnimating, setEnvelopeAnimating] = useState(false);
  const [activeChapter, setActiveChapter] = useState<ChapterId>("welcome");
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const [celebrationId, setCelebrationId] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [countdown, setCountdown] = useState<CountdownParts | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    let disposed = false;
    const removeGestureListeners = () => {
      document.removeEventListener("pointerdown", startAfterGesture);
      document.removeEventListener("keydown", startAfterGesture);
    };
    const startMusic = async () => {
      try {
        await audio.play();
        if (!disposed) setMusicOn(true);
        removeGestureListeners();
      } catch {
        setMusicOn(false);
      }
    };
    const startAfterGesture = () => void startMusic();

    void startMusic();
    document.addEventListener("pointerdown", startAfterGesture);
    document.addEventListener("keydown", startAfterGesture);

    return () => {
      disposed = true;
      removeGestureListeners();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = new Date(invitation.event.startsAt).getTime() - Date.now();
      if (remaining <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const secondsRemaining = Math.floor(remaining / 1000);
      setCountdown({
        days: Math.floor(secondsRemaining / 86_400),
        hours: Math.floor((secondsRemaining % 86_400) / 3_600),
        minutes: Math.floor((secondsRemaining % 3_600) / 60),
        seconds: secondsRemaining % 60,
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const currentIndex = invitationChapters.findIndex((chapter) => chapter.id === activeChapter);
  const chapter = invitationChapters[currentIndex];

  const openInvitation = () => {
    if (envelopeAnimating) return;
    setEnvelopeAnimating(true);
    window.setTimeout(() => {
      setOpened(true);
      setEnvelopeAnimating(false);
      setActiveChapter("welcome");
      setCelebrationId((id) => id + 1);
    }, 1100);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }

    try {
      await audio.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  };

  const moveChapter = (direction: -1 | 1) => {
    const nextIndex = Math.min(
      Math.max(currentIndex + direction, 0),
      invitationChapters.length - 1,
    );
    const nextChapter = invitationChapters[nextIndex];
    if (nextChapter) setActiveChapter(nextChapter.id);
  };

  const returnToCover = () => {
    setOpened(false);
    setChapterMenuOpen(false);
  };

  return (
    <main className="invitation-world">
      <OrnamentalFrame />
      {!opened ? (
        <Cover
          animating={envelopeAnimating}
          onOpen={openInvitation}
          onSkip={() => {
            setOpened(true);
            setActiveChapter("welcome");
            setCelebrationId((id) => id + 1);
          }}
        />
      ) : (
        <div className="invitation-reader">
          <header className="reader-toolbar" aria-label={t("toolbar.aria")}>
            <button className="monogram-lockup" type="button" onClick={returnToCover}>
              <span className="monogram-mark" aria-hidden="true">
                R<span>&</span>S
              </span>
              <span className="monogram-caption">{t("couple.full")}</span>
            </button>

            <div className="toolbar-actions">
              <Button
                variant="ghost"
                className="toolbar-button"
                aria-label={t("lang.switchAria")}
                onClick={toggleLang}
              >
                <Languages aria-hidden="true" />
                <span className="toolbar-label">{t("lang.name")}</span>
              </Button>
              <Button
                variant="ghost"
                className="toolbar-button"
                aria-label={musicOn ? t("toolbar.turnOff") : t("toolbar.turnOn")}
                title={musicOn ? t("toolbar.turnOff") : t("toolbar.playTitle")}
                onClick={toggleMusic}
              >
                {musicOn ? <Music2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
                <span className="toolbar-label">
                  {musicOn ? t("toolbar.musicOn") : t("toolbar.musicOff")}
                </span>
              </Button>
              <Button variant="ghost" className="toolbar-button" onClick={returnToCover}>
                <Mail aria-hidden="true" />
                <span className="toolbar-label">{t("toolbar.cover")}</span>
              </Button>
              <div className="chapter-menu-wrap">
                <Button
                  variant="ghost"
                  className="toolbar-button"
                  aria-expanded={chapterMenuOpen}
                  aria-controls="chapter-menu"
                  onClick={() => setChapterMenuOpen((open) => !open)}
                >
                  <span className="toolbar-label">{t("toolbar.pages")}</span>
                  <ChevronDown aria-hidden="true" />
                </Button>
                {chapterMenuOpen && (
                  <nav
                    className="chapter-menu"
                    id="chapter-menu"
                    aria-label={t("toolbar.pagesAria")}
                  >
                    <p className="menu-eyebrow">{t("menu.eyebrow")}</p>
                    {invitationChapters.map((item, index) => (
                      <button
                        className={`chapter-menu-item${item.id === activeChapter ? " is-active" : ""}`}
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveChapter(item.id);
                          setChapterMenuOpen(false);
                        }}
                      >
                        <span className="menu-page-number">0{index + 1}</span>
                        <span>{pick(item.title, item.titleBn)}</span>
                      </button>
                    ))}
                  </nav>
                )}
              </div>
            </div>
          </header>

          <div className="chapter-heading" aria-live="polite">
            <span className="chapter-kicker">
              {pick(chapter?.kicker ?? "", chapter?.kickerBn ?? "")}
            </span>
            <span className="chapter-progress">
              {String(currentIndex + 1).padStart(2, "0")} / 06
            </span>
          </div>

          <section className="chapter-paper" key={activeChapter}>
            <div className="paper-top-ornament" aria-hidden="true">
              <FlowerMark />
              <span />
              <FlowerMark />
            </div>
            {chapter && <ChapterContent chapter={chapter.id} countdown={countdown} />}
            <div className="paper-bottom-ornament" aria-hidden="true">
              <span />
              <Sparkles />
              <span />
            </div>
          </section>

          <nav className="page-navigation" aria-label={t("nav.aria")}>
            <Button
              variant="ghost"
              className="page-nav-button"
              onClick={() => moveChapter(-1)}
              disabled={currentIndex === 0}
              aria-label={t("nav.prevAria")}
            >
              <ChevronLeft aria-hidden="true" />
              <span>{t("nav.prev")}</span>
            </Button>
            <span className="page-counter">
              {t("nav.page", { current: currentIndex + 1, total: 6 })}
            </span>
            <Button
              variant="ghost"
              className="page-nav-button"
              onClick={() => moveChapter(1)}
              disabled={currentIndex === invitationChapters.length - 1}
              aria-label={t("nav.nextAria")}
            >
              <span>{t("nav.next")}</span>
              <ChevronRight aria-hidden="true" />
            </Button>
          </nav>
        </div>
      )}
      {celebrationId > 0 && <CelebrationConfetti key={celebrationId} />}
    </main>
  );
}

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function Cover({
  animating,
  onOpen,
  onSkip,
}: {
  animating: boolean;
  onOpen: () => void;
  onSkip: () => void;
}) {
  const { toggleLang, t } = useLang();
  return (
    <section className="cover-scene" aria-labelledby="cover-title">
      <button
        className="cover-lang-toggle"
        type="button"
        onClick={toggleLang}
        aria-label={t("lang.switchAria")}
      >
        {t("lang.name")}
      </button>
      <div className="cover-intro">
        <span className="invocation">{t("cover.invocation")}</span>
        <h1 id="cover-title">
          <span className="sr-only">Rahul and Soumi wedding reception invitation — </span>
          <TitleLines text={t("cover.title")} />
        </h1>
        <p>{t("cover.subtitle")}</p>
        <div className="ornamental-divider" aria-hidden="true">
          <span />✦<span />
        </div>
      </div>

      <div
        className={`invitation-envelope${animating ? " is-opening" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={t("cover.envelopeAria")}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
      >
        <div className="envelope-back" />
        <div className="envelope-letter">
          <span className="letter-salutation">{t("cover.letterSalutation")}</span>
          <span className="letter-names">
            {t("couple.first")} <i>{t("couple.amp")}</i> {t("couple.last")}
          </span>
        </div>
        <div className="envelope-flap" />
        <div className="envelope-front" />
        <span className="envelope-ribbon" />
        <span className="envelope-stamp" aria-hidden="true">
          <Heart fill="currentColor" />
          <span>R &amp; S</span>
        </span>
      </div>

      <div className="cover-actions">
        <Button className="open-invitation-button" onClick={onOpen}>
          <Mail aria-hidden="true" />
          {t("cover.open")}
          <ArrowRight aria-hidden="true" />
        </Button>
        <button className="skip-invitation-button" type="button" onClick={onSkip}>
          {t("cover.skip")} <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <p className="cover-blessing">{t("blessing.only")}</p>
    </section>
  );
}

function ChapterContent({
  chapter,
  countdown,
}: {
  chapter: ChapterId;
  countdown: CountdownParts | null;
}) {
  if (chapter === "welcome") {
    return <WelcomeChapter countdown={countdown} />;
  }
  if (chapter === "families") {
    return <FamiliesChapter />;
  }
  if (chapter === "ceremony") {
    return <CeremonyChapter />;
  }
  if (chapter === "venue") {
    return <VenueChapter />;
  }
  if (chapter === "letter") {
    return <LetterChapter />;
  }
  return <ClosingChapter />;
}

function WelcomeChapter({ countdown }: { countdown: CountdownParts | null }) {
  const { t, pick } = useLang();
  return (
    <div className="chapter-content welcome-content">
      <p className="sanskrit-line">॥ OM SRI PRAJAPATAYE NAMAH ॥</p>
      <div className="chapter-emblem" aria-hidden="true">
        <FlowerMark />
        <span className="emblem-center">॥</span>
      </div>
      <h2 className="paper-title">
        <TitleLines text={t("welcome.title")} />
      </h2>
      <p className="chapter-lede">{t("welcome.lede")}</p>
      <div className="host-invitation">
        <p>{pick(invitation.hosts, invitation.hostsBn)}</p>
        <span>{t("welcome.hostRequest")}</span>
      </div>
      <p className="couple-names">
        {t("couple.first")} <span>{t("couple.amp")}</span> {t("couple.last")}
      </p>
      <div className="reception-summary">
        <div className="summary-item">
          <CalendarDays aria-hidden="true" />
          <div>
            <span>{t("welcome.dateLabel")}</span>
            <strong>{pick(invitation.event.dateLabel, invitation.event.dateLabelBn)}</strong>
          </div>
        </div>
        <div className="summary-item">
          <Clock3 aria-hidden="true" />
          <div>
            <span>{t("welcome.reception")}</span>
            <strong>{pick(invitation.event.timeLabel, invitation.event.timeLabelBn)}</strong>
          </div>
        </div>
        <div className="summary-item">
          <MapPin aria-hidden="true" />
          <div>
            <span>{t("welcome.venue")}</span>
            <strong>{pick(invitation.event.venue, invitation.event.venueBn)}</strong>
          </div>
        </div>
      </div>
      <Countdown countdown={countdown} />
      <p className="blessing-only">{t("blessing.only")}</p>
    </div>
  );
}

function Countdown({ countdown }: { countdown: CountdownParts | null }) {
  const { t } = useLang();
  const units = [
    { label: t("countdown.days"), value: countdown?.days },
    { label: t("countdown.hours"), value: countdown?.hours },
    { label: t("countdown.mins"), value: countdown?.minutes },
    { label: t("countdown.secs"), value: countdown?.seconds },
  ];

  return (
    <div className="countdown-block" aria-label={t("countdown.aria")}>
      <p className="section-eyebrow">{t("countdown.title")}</p>
      <div className="countdown-grid">
        {units.map(({ label, value }) => (
          <div className="countdown-unit" key={label}>
            <strong>{value === undefined ? "—" : String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FamiliesChapter() {
  const { t, pick } = useLang();
  return (
    <div className="chapter-content">
      <ChapterHeading
        eyebrow={t("families.eyebrow")}
        title={t("families.title")}
        subtitle={t("families.subtitle")}
      />
      <div className="family-grid">
        <FamilyProfile
          variant="groom"
          label={t("families.groom")}
          name={pick(invitation.groom.name, invitation.groom.nameBn)}
          father={pick(invitation.groom.father, invitation.groom.fatherBn)}
          mother={pick(invitation.groom.mother, invitation.groom.motherBn)}
          address={pick(invitation.groom.address, invitation.groom.addressBn)}
          image={groomPlaceholder}
        />
        <FamilyProfile
          variant="bride"
          label={t("families.bride")}
          name={pick(invitation.bride.name, invitation.bride.nameBn)}
          father={pick(invitation.bride.father, invitation.bride.fatherBn)}
          mother={pick(invitation.bride.mother, invitation.bride.motherBn)}
          address={pick(invitation.bride.address, invitation.bride.addressBn)}
          image={bridePlaceholder}
        />
      </div>
      <div className="family-blessing">
        <FlowerMark />
        <p>{t("families.blessing")}</p>
        <FlowerMark />
      </div>
    </div>
  );
}

function FamilyProfile({
  variant,
  label,
  name,
  father,
  mother,
  address,
  image,
}: {
  variant: "groom" | "bride";
  label: string;
  name: string;
  father: string;
  mother: string;
  address: string;
  image: string;
}) {
  const { t } = useLang();
  return (
    <article className="family-profile">
      <span className="family-label">{label}</span>
      <img
        className={`family-portrait${variant === "bride" ? " family-portrait--bride" : ""}`}
        src={image}
        alt={t("families.portraitAlt", { label })}
        width={768}
        height={1024}
        loading="lazy"
      />
      <h3>{name}</h3>
      <div className="profile-rule" />
      <dl>
        <div>
          <dt>{t("families.father")}</dt>
          <dd>{father}</dd>
        </div>
        <div>
          <dt>{t("families.mother")}</dt>
          <dd>{mother}</dd>
        </div>
        <div>
          <dt>{t("families.address")}</dt>
          <dd>{address}</dd>
        </div>
      </dl>
    </article>
  );
}

function CeremonyChapter() {
  const { t, pick } = useLang();
  const calendarUrl = getGoogleCalendarUrl();
  return (
    <div className="chapter-content">
      <ChapterHeading
        eyebrow={t("ceremony.eyebrow")}
        title={t("ceremony.title")}
        subtitle={t("ceremony.subtitle")}
      />
      <article className="ceremony-feature">
        <div className="ceremony-number" aria-hidden="true">
          ॥
        </div>
        <div className="ceremony-details">
          <span className="section-eyebrow">{t("ceremony.receptionLabel")}</span>
          <h3>
            {t("couple.first")} <i>{t("couple.amp")}</i> {t("couple.last")}
          </h3>
          <div className="ceremony-detail-row">
            <CalendarDays aria-hidden="true" />
            <span>{pick(invitation.event.dateLabel, invitation.event.dateLabelBn)}</span>
          </div>
          <div className="ceremony-detail-row">
            <Clock3 aria-hidden="true" />
            <span>{pick(invitation.event.timeLabel, invitation.event.timeLabelBn)}</span>
          </div>
          <div className="ceremony-detail-row">
            <MapPin aria-hidden="true" />
            <span>{pick(invitation.event.venue, invitation.event.venueBn)}</span>
          </div>
          <a className="calendar-link" href={calendarUrl} target="_blank" rel="noreferrer">
            <CalendarDays aria-hidden="true" /> {t("ceremony.addCalendar")}{" "}
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <span className="ceremony-flower" aria-hidden="true">
          <FlowerMark />
        </span>
      </article>
      <div className="ceremony-note">
        <Sparkles aria-hidden="true" />
        <span>{t("blessing.only")}</span>
        <Sparkles aria-hidden="true" />
      </div>
    </div>
  );
}

function VenueChapter() {
  const { t, pick } = useLang();
  return (
    <div className="chapter-content">
      <ChapterHeading
        eyebrow={t("venue.eyebrow")}
        title={t("venue.title")}
        subtitle={t("venue.subtitle")}
      />
      <div className="venue-illustration" aria-hidden="true">
        <div className="venue-sun" />
        <div className="venue-arch venue-arch-back" />
        <div className="venue-arch venue-arch-front">
          <span>॥</span>
        </div>
        <div className="venue-ground" />
        <span className="venue-flower venue-flower-left">
          <FlowerMark />
        </span>
        <span className="venue-flower venue-flower-right">
          <FlowerMark />
        </span>
      </div>
      <div className="venue-information">
        <span className="section-eyebrow">{t("venue.venueLabel")}</span>
        <h3>{pick(invitation.event.venue, invitation.event.venueBn)}</h3>
        <p>{pick(invitation.event.city, invitation.event.cityBn)}</p>
        <span className="venue-divider" />
        <p className="venue-date">
          <CalendarDays aria-hidden="true" />{" "}
          {pick(invitation.event.dateLabel, invitation.event.dateLabelBn)} ·{" "}
          {pick(invitation.event.timeLabel, invitation.event.timeLabelBn)}
        </p>
        <a
          className="map-directions"
          href={invitation.event.mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Navigation aria-hidden="true" /> {t("venue.mapLink")} <ArrowRight aria-hidden="true" />
        </a>
        <div className="venue-contacts" aria-label={t("venue.contactsAria")}>
          <span className="section-eyebrow">{t("venue.contactsLabel")}</span>
          <div>
            {invitation.event.contactNumbers.map((number) => (
              <a href={`tel:${number}`} key={number}>
                <Phone aria-hidden="true" /> {number}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LetterChapter() {
  const { t, pick } = useLang();
  const hosts = pick(invitation.hosts, invitation.hostsBn);
  const date = pick(invitation.event.dateLabel, invitation.event.dateLabelBn);
  const time = pick(invitation.event.timeLabel, invitation.event.timeLabelBn);
  const venue = pick(invitation.event.venue, invitation.event.venueBn);
  const city = pick(invitation.event.city, invitation.event.cityBn);
  return (
    <div className="chapter-content letter-content">
      <ChapterHeading
        eyebrow={t("letter.eyebrow")}
        title={t("letter.title")}
        subtitle={t("letter.subtitle")}
      />
      <article className="invitation-letter">
        <span className="letter-top-mark" aria-hidden="true">
          ❧
        </span>
        <p>{t("letter.body1", { hosts })}</p>
        <p className="letter-couple">{t("couple.full")}</p>
        <p>{t("letter.body3", { date, time, venue, city })}</p>
        <p>{t("letter.body4")}</p>
        <p className="letter-signoff">
          {t("letter.signoff")}
          <br />
          <strong>{t("letter.signoffName")}</strong>
        </p>
        <span className="letter-bottom-mark" aria-hidden="true">
          ❧
        </span>
      </article>
    </div>
  );
}

function ClosingChapter() {
  const { t, pick } = useLang();
  return (
    <div className="chapter-content closing-content">
      <div className="closing-emblem">
        <FlowerMark />
        <Heart fill="currentColor" aria-hidden="true" />
      </div>
      <span className="section-eyebrow">{t("closing.eyebrow")}</span>
      <h2 className="paper-title">
        <TitleLines text={t("closing.title")} />
      </h2>
      <p className="closing-copy">{t("closing.copy")}</p>
      <p className="closing-names">
        {t("couple.first")} <span>{t("couple.amp")}</span> {t("couple.last")}
      </p>
      <div className="closing-details">
        <span>{pick(invitation.event.dateLabel, invitation.event.dateLabelBn)}</span>
        <span className="closing-separator">✦</span>
        <span>
          {pick(invitation.event.venue, invitation.event.venueBn)},{" "}
          {pick(invitation.event.city, invitation.event.cityBn)}
        </span>
      </div>
      <div className="closing-blessing">{t("blessing.only")}</div>
      <Button
        className="closing-return"
        variant="outline"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowLeft aria-hidden="true" /> {t("closing.return")}
      </Button>
    </div>
  );
}

function TitleLines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

const CONFETTI_COLORS = [
  "#E8B84B",
  "#FFF3DC",
  "#C9971F",
  "#9E2A2B",
  "#F4D58A",
  "#FFFFFF",
  "#D4A017",
];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  width: number;
  height: number;
  drift: number;
  spin: number;
  radius: string;
}

function makeConfettiPieces(): ConfettiPiece[] {
  return Array.from({ length: 110 }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 0.7,
    duration: 1.7 + Math.random() * 1.3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? "#E8B84B",
    width: 6 + Math.random() * 7,
    height: 8 + Math.random() * 9,
    drift: (Math.random() - 0.5) * 240,
    spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540),
    radius: Math.random() < 0.35 ? "50%" : "2px",
  }));
}

function CelebrationConfetti() {
  const pieces = useMemo(makeConfettiPieces, []);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          className="confetti-piece"
          key={piece.id}
          style={
            {
              left: `${piece.left}%`,
              width: `${piece.width}px`,
              height: `${piece.height}px`,
              background: piece.color,
              borderRadius: piece.radius,
              "--confetti-delay": `${piece.delay}s`,
              "--confetti-duration": `${piece.duration}s`,
              "--confetti-drift": `${piece.drift}px`,
              "--confetti-spin": `${piece.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ChapterHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="content-heading">
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="paper-title">{title}</h2>
      <p>{subtitle}</p>
      <div className="ornamental-divider" aria-hidden="true">
        <span />✦<span />
      </div>
    </header>
  );
}

function OrnamentalFrame() {
  return (
    <div className="ornamental-frame" aria-hidden="true">
      <div className="frame-rail frame-rail-left" />
      <div className="frame-rail frame-rail-right" />
      <span className="frame-corner frame-corner-tl">
        <FlowerMark />
      </span>
      <span className="frame-corner frame-corner-tr">
        <FlowerMark />
      </span>
      <span className="frame-corner frame-corner-bl">
        <FlowerMark />
      </span>
      <span className="frame-corner frame-corner-br">
        <FlowerMark />
      </span>
      <span className="frame-side-mark frame-side-left">
        <FlowerMark />
      </span>
      <span className="frame-side-mark frame-side-right">
        <FlowerMark />
      </span>
    </div>
  );
}

function FlowerMark() {
  return (
    <svg className="flower-mark" viewBox="0 0 100 100" fill="none">
      <g stroke="currentColor" strokeWidth="2.2">
        <ellipse cx="50" cy="29" rx="10" ry="20" />
        <ellipse cx="50" cy="29" rx="10" ry="20" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="29" rx="10" ry="20" transform="rotate(120 50 50)" />
        <ellipse cx="50" cy="29" rx="10" ry="20" transform="rotate(180 50 50)" />
        <ellipse cx="50" cy="29" rx="10" ry="20" transform="rotate(240 50 50)" />
        <ellipse cx="50" cy="29" rx="10" ry="20" transform="rotate(300 50 50)" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
      </g>
    </svg>
  );
}
