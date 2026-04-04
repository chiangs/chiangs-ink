const PAGE_TITLE = "Contact — Stephen Chiang";
const SECTION_LABEL = "Contact";
const HEADING = "Let's talk.";
const DESCRIPTION =
  "Available for consulting engagements, advisory roles, and interesting problems. Based in Stavanger, Norway — CET timezone.";
const EMAIL = "stephen@chiang.studio";
const HREF_EMAIL = `mailto:${EMAIL}`;
const LABEL_NAME = "Name";
const LABEL_EMAIL = "Email";
const LABEL_MESSAGE = "Message";
const PLACEHOLDER_NAME = "Your name";
const PLACEHOLDER_EMAIL = "your@email.com";
const PLACEHOLDER_MESSAGE = "Tell me what you're working on…";
const LABEL_SUBMIT = "Send Message";

export function meta() {
  return [{ title: PAGE_TITLE }];
}

export default function Contact() {
  return (
    <main className="py-section-mob md:py-section">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted mb-6">
              {SECTION_LABEL}
            </p>
            <h1 className="font-display font-black text-[clamp(40px,6vw,72px)] text-text-primary leading-[0.95] mb-8">
              {HEADING}
            </h1>
            <p className="text-base text-text-muted leading-[1.75] mb-8">
              {DESCRIPTION}
            </p>
            <a
              href={HREF_EMAIL}
              className="text-sm font-medium uppercase tracking-[0.15em] text-accent border-b border-border-accent pb-0.5 hover:opacity-60 transition-opacity duration-200"
            >
              {EMAIL}
            </a>
          </div>

          {/* Right — form */}
          <form className="flex flex-col gap-10 bg-card p-10">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
                {LABEL_NAME}
              </label>
              <input
                type="text"
                name="name"
                required
                className="bg-transparent border-0 border-b border-border-accent text-text-primary text-base py-2 outline-none focus:border-border-accent placeholder:text-text-muted"
                placeholder={PLACEHOLDER_NAME}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
                {LABEL_EMAIL}
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-transparent border-0 border-b border-border-accent text-text-primary text-base py-2 outline-none focus:border-border-accent placeholder:text-text-muted"
                placeholder={PLACEHOLDER_EMAIL}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
                {LABEL_MESSAGE}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="bg-transparent border-0 border-b border-border-accent text-text-primary text-base py-2 outline-none focus:border-border-accent placeholder:text-text-muted resize-none"
                placeholder={PLACEHOLDER_MESSAGE}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-invert-bg text-invert-text font-display font-bold text-sm uppercase tracking-[0.15em] py-4 hover:bg-bg hover:text-accent border border-border-accent transition-colors duration-200"
            >
              {LABEL_SUBMIT}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
