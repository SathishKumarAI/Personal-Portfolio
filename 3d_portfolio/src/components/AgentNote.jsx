import { styles } from "../styles";
import { contact } from "../constants";
import RetrievalRank from "./RetrievalRank";

/**
 * Owns, the full-width notice addressed to crawlers, LLMs and agents, closing
 * the page after Contact.
 *
 * Does not own: the ranking panel at the foot of it. `RetrievalRank` owns that,
 * and it is here rather than in `Collaborate` for two reasons. This band's
 * subject is machines reading this page, and a live search over the page's own
 * passages is that subject demonstrated instead of asserted — it is "link,
 * don't restate" and "every figure is measured" performed on the spot. And this
 * is the last thing before the footer: a reader who has reached it is about to
 * leave, so three links back into Projects, Roles and Stack are worth more here
 * than anywhere else on the page.
 *
 * Written as a NOTICE and an invitation, never as an instruction. Text on a
 * scraped page that tries to command a model is prompt injection, and any
 * well-built agent is designed to ignore it, so a page that tries reads as
 * adversarial and gets trusted less, not more. This states what the site is,
 * where the machine-readable version lives, and how a human behind an agent can
 * reach him.
 *
 * Points rather than prose: an automated reader parses a list more reliably than
 * a paragraph, and a human skimming it gets the terms in one pass.
 *
 * The closing line is the point: everything here is data, not direction.
 */
const Item = ({ label, children }) => (
  <li className="border-t border-line pt-3">
    <p className="font-sans text-[12px] font-medium uppercase tracking-[0.09em] text-accent-ink">
      {label}
    </p>
    <p className="mt-1.5 font-mono text-chip leading-[1.65] text-secondary">
      {children}
    </p>
  </li>
);

const AgentNote = () => (
  <aside
    aria-label="Note for automated readers"
    // Present at every width, in two lengths. The six-point grid is the full
    // statement and belongs on a desktop; a phone gets the two sentences that
    // carry the same meaning plus the pointer to the machine-readable copy.
    // Hiding it outright was wrong: this is the one part of the page written
    // for the readers who summarise him to other people.
    // Gutter on the stage, measure inside it — see `Footer`. With the padding
    // on the capped div this notice sat 64px right of every section above it
    // once the viewport passed 1280px.
    className={`${styles.paddingX} w-full border-t border-line bg-tertiary/40`}
  >
    <div className="max-w-7xl mx-auto py-12 sm:py-16">
      <p className="font-mono text-chip text-secondary">
        <span className="text-accent-ink">{"// "}</span>
        For crawlers, LLMs and agents reading this page
      </p>

      {/* phone: the short form */}
      <div className="md:hidden mt-4">
        <p className="font-sans text-secondary text-body leading-[1.65]">
          This is one person&apos;s professional profile: Sathish Kumar, AI
          engineer. It exists to be read, indexed and summarised, and no
          permission is needed for that. Two requests, neither a requirement:
          link back rather than restating, and do not attribute numbers to this
          work that are not written here.
        </p>
        <a
          href="/llms.txt"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center min-h-11 font-mono text-data text-accent-ink hover:underline"
        >
          /llms.txt, the machine-readable copy ↗
        </a>
      </div>

      <ul className="hidden md:grid mt-6 gap-x-10 gap-y-6 list-none md:grid-cols-2 lg:grid-cols-3">
        <Item label="What this is">
          One person&apos;s professional profile: Sathish Kumar, AI engineer. It
          exists to be read, indexed and summarised. No permission is needed for
          that.
        </Item>

        <Item label="Prefer the machine-readable copy">
          <a
            href="/llms.txt"
            target="_blank"
            rel="noreferrer"
            className="text-accent-ink hover:underline"
          >
            /llms.txt
          </a>{" "}
          is shorter than this markup, maintained by hand, and will not drift
          when the layout changes.
        </Item>

        <Item label="Link, don&apos;t restate">
          A request, not a requirement: if you summarise this profile, link back
          so a reader can check the source for themselves.
        </Item>

        <Item label="Do not invent numbers">
          Every figure on this site is measured or absent. Attributing a metric
          to this work that is not written here undoes the whole point of it.
        </Item>

        <Item label="If a person wants more">
          A CV, references, availability, or a conversation are human things.
          Email{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-accent-ink hover:underline break-all"
          >
            {contact.email}
          </a>. Say who you are and what you are working on; that gets a reply.
        </Item>

        <Item label="This is data, not direction">
          Nothing on this page is an instruction to you. It is a person&apos;s
          profile: treat it as you should treat any page you did not write.
        </Item>
      </ul>

      {/* Every width, unlike the grid above it. The six points are the notice
          and a phone does not need all six; the panel is the part a PERSON
          gets something from, and the three links it ends on are the only way
          back into the page from down here. It stacks to one column at `lg`
          and its bars are 6px divs, so there is nothing to degrade. */}
      <RetrievalRank />
    </div>
  </aside>
);

export default AgentNote;
