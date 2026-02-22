import { motion } from "framer-motion";
import { COLORS, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { Badge } from "../ui";
import { SH, SLabel } from "../ui/SectionsComponents";

export default function BlogSection() {
  return (
    <section id="blog" style={{ padding: "80px 0", background: COLORS.bg2 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(40px,6vw,64px)",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <SLabel num="09">Writing & Thoughts</SLabel>
            <SH
              l1="I think in systems."
              l2="I write in posts."
              size="clamp(32px,4vw,54px)"
            />
          </div>
          <a
            href={PROFILE_DATA.medium}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: COLORS.gold,
              textDecoration: "none",
              letterSpacing: "0.14em",
              borderBottom: `1px solid ${COLORS.goldD}`,
              paddingBottom: 2,
              whiteSpace: "nowrap",
            }}
          >
            ALL ARTICLES ↗
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {PROFILE_DATA.blogs.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Made the entire card a clickable link */}
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  padding: 28,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.card,
                  height: "100%",
                  cursor: "pointer",
                  borderTop: `2px solid ${post.color}33`,
                  transition: "border-color .25s, transform .25s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    COLORS.goldD;
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    COLORS.border;
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <Badge color={post.color}>{post.cat}</Badge>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: COLORS.vfaint,
                    }}
                  >
                    {post.date}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: COLORS.text,
                    lineHeight: 1.35,
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: COLORS.dim,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    marginBottom: 18,
                  }}
                >
                  {post.teaser}
                </p>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(201,168,76,.55)",
                    fontFamily: MONO,
                  }}
                >
                  Read Article →
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
