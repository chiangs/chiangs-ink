// LanguageList — Languages section for About page

const LANGUAGES = [
  { name: "English", proficiency: "NATIVE" },
  { name: "Norwegian", proficiency: "PROFESSIONAL" },
  { name: "Danish", proficiency: "PROFESSIONAL" },
  { name: "Mandarin Chinese", proficiency: "CONVERSATIONAL" },
] as const;

const LANG_NOTE =
  "Working across 8 countries and 4 languages has shaped how I think about communication, precision, and the assumptions we make when we share a common language.";

export function LanguageList() {
  return (
    <>
      <div>
        {LANGUAGES.map((lang, i) => (
          <div
            key={lang.name}
            data-anim="language-row"
            className="flex items-center justify-between"
            style={{
              borderBottom: "1px solid #1e1e1e",
              paddingBottom: "20px",
              marginBottom: i < LANGUAGES.length - 1 ? "20px" : 0,
            }}
          >
            <span
              className="font-display font-bold text-text-primary"
              style={{ fontSize: "24px" }}
            >
              {lang.name}
            </span>
            <span
              className="font-body font-medium uppercase"
              style={{
                fontSize: "11px",
                color: "#FFB77D",
                letterSpacing: "0.15em",
              }}
            >
              {lang.proficiency}
            </span>
          </div>
        ))}
      </div>

      <p
        className="font-body text-text-muted"
        style={{
          fontSize: "14px",
          fontStyle: "italic",
          lineHeight: 1.7,
          marginTop: "32px",
          maxWidth: "520px",
        }}
      >
        "{LANG_NOTE}"
      </p>
    </>
  );
}
