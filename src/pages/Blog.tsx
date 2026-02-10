import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: "gut-feeling-vs-intrusive-thoughts",
    category: "Understanding Intuition",
    date: "Jan 2025",
    readTime: "5 min read",
    title: "Your Gut Feeling Is Not an Intrusive Thought — Here's How to Tell the Difference",
    excerpt:
      "Most people conflate the two. An intrusive thought is loud, anxious, and repetitive — it feeds on fear. A gut feeling is quiet, calm, and persistent. It doesn't scream; it just knows. Learning to distinguish between them is the first step toward trusting yourself again.",
    content: [
      "We've all been there. A decision lands in front of you, and your mind splits into a dozen voices — some fearful, some excited, some just noise. The challenge isn't making the decision. It's knowing which voice to listen to.",
      "Intrusive thoughts are anxiety in disguise. They spiral. They catastrophize. They repeat themselves because they need your attention to survive. A gut feeling, on the other hand, doesn't demand anything. It sits quietly in your chest or your stomach, waiting for you to notice.",
      "The difference matters because most people override their intuition thinking it's just another anxious thought. They rationalize, deliberate, and ultimately make a decision from fear — not from wisdom.",
      "Hara was built for exactly this. By tracking when your gut speaks and what happens when you listen (or don't), you start building a personal evidence base. Over time, you learn to recognize the texture of genuine intuition versus the static of anxiety.",
      "The founders, the creatives, the leaders who move fast — they're not reckless. They've just learned to read the signal. And that's a skill anyone can develop.",
    ],
  },
  {
    id: "science-of-intuition",
    category: "The Science",
    date: "Dec 2024",
    readTime: "7 min read",
    title: "The Science Behind Why Your Gut Is Right More Often Than You Think",
    excerpt:
      "Neuroscience calls it somatic intelligence — your body processing millions of data points before your conscious mind even registers a thought. Your gut isn't guessing. It's computing.",
    content: [
      "There's a reason we say 'trust your gut.' The enteric nervous system — sometimes called the 'second brain' — contains over 100 million neurons. It communicates with your brain through the vagus nerve, sending signals that influence your emotions, your decisions, and your sense of what's right.",
      "Research from the University of Iowa demonstrated that people begin making better decisions based on gut feelings long before they can consciously explain why. The body knows before the mind catches up.",
      "This isn't mysticism. It's pattern recognition operating below the threshold of awareness. Every experience you've ever had — every relationship, every negotiation, every risk you've taken — is encoded in your nervous system. Your gut feeling is your subconscious pulling from that entire library.",
      "The problem? Modern life teaches us to dismiss these signals. We're told to 'think it through,' to 'be rational,' to 'not be emotional.' But the data suggests that the most effective decision-makers are the ones who integrate both — analytical thinking and intuitive knowing.",
      "Hara bridges that gap. By giving you a structured way to log, track, and reflect on your gut feelings, it transforms intuition from something vague into something measurable. You're not just trusting your gut — you're building evidence for it.",
    ],
  },
  {
    id: "decision-fatigue-and-intuition",
    category: "Performance",
    date: "Nov 2024",
    readTime: "4 min read",
    title: "Decision Fatigue Is Real — Your Intuition Is the Antidote",
    excerpt:
      "The average person makes 35,000 decisions a day. No wonder we're exhausted. But what if the answer isn't more frameworks — it's learning to let your gut carry the load?",
    content: [
      "Decision fatigue isn't just about being tired. It's about cognitive depletion — the gradual erosion of your ability to make good choices as the day wears on. By afternoon, your prefrontal cortex is running on fumes.",
      "This is where intuition becomes a competitive advantage. Your gut doesn't get fatigued the same way. It operates on a different system — one that's faster, more efficient, and often more accurate for the kinds of ambiguous decisions that don't have a clear 'right answer.'",
      "The founders and executives who perform at the highest level have learned this instinctively. They don't deliberate on everything. They reserve analytical thinking for what truly requires it and let intuition handle the rest.",
      "But here's the catch: you can only trust your gut if you've built a track record with it. That's where most people get stuck. They want to trust themselves, but they don't have the evidence to back it up.",
      "That's exactly what Hara provides — a personal track record of your intuitive accuracy. When you can see that your gut was right 80% of the time on hiring decisions, or that your morning intuition outperforms your evening deliberation, you stop second-guessing. You start moving.",
    ],
  },
  {
    id: "morning-intuition-peak",
    category: "Patterns",
    date: "Oct 2024",
    readTime: "5 min read",
    title: "Why Your Best Decisions Happen Before Noon",
    excerpt:
      "Pattern data from Hara users reveals a striking trend: intuitive accuracy peaks in the morning hours. Here's why — and how to structure your day around it.",
    content: [
      "One of the most consistent patterns we see in Hara users' data is that gut-feeling accuracy is significantly higher in the morning. Not by a small margin — we're talking about a meaningful difference in outcome quality.",
      "The neuroscience supports this. Morning hours benefit from restored cognitive resources, lower cortisol baseline (before the stress of the day accumulates), and a nervous system that hasn't yet been overwhelmed by stimuli.",
      "Your body is essentially in its most receptive state. The signals from your enteric nervous system — your gut brain — are clearest when there's less noise competing for your attention.",
      "Several Hara users have restructured their entire work days around this insight. One founder moved all critical decisions — hiring, strategy, partnerships — to before noon. The result? Faster decisions, better outcomes, and significantly less decision regret.",
      "This isn't about being a 'morning person.' It's about understanding your own patterns. Hara makes these patterns visible. Some users discover their peak is actually late evening. Others find it's right after exercise. The point is: your intuition has a rhythm, and once you know it, you can work with it instead of against it.",
    ],
  },
  {
    id: "trust-yourself-framework",
    category: "Philosophy",
    date: "Sep 2024",
    readTime: "6 min read",
    title: "The Trust Yourself Framework: From Self-Doubt to Self-Authority",
    excerpt:
      "Self-trust isn't something you're born with or without. It's built — through repeated evidence that your inner voice knows what it's talking about. Here's how.",
    content: [
      "We live in a culture that systematically undermines self-trust. From childhood, we're taught to defer to authority, to seek external validation, to doubt our own perceptions. By the time we're adults, most of us have a deeply fractured relationship with our own knowing.",
      "Rebuilding that trust isn't about affirmations or positive thinking. It's about evidence. When you can look back at a track record of moments where your gut was right — and moments where ignoring it cost you — the pattern becomes undeniable.",
      "The Trust Yourself Framework has three phases. First, awareness: simply noticing when your gut speaks. Most people are so disconnected from their body signals that they miss intuitive hits entirely. Hara's check-in system trains this muscle.",
      "Second, courage: choosing to honor your gut feeling even when it contradicts logic, social pressure, or the 'safe' choice. This is where most people struggle. The check-in process asks you to note whether you honored or ignored your intuition — creating accountability without judgment.",
      "Third, integration: reviewing outcomes and building your personal evidence base. This is where genuine self-authority is born. Not from blind confidence, but from the quiet certainty that comes with data. You've seen the pattern. You know when to trust yourself. And that knowledge changes everything.",
    ],
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-background/20">
          <div className="flex items-center gap-8">
            <Link
              to="/about"
              className="text-xl font-light tracking-wide bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Hara
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="text-foreground">Blog</span>
            </div>
          </div>
          <Button asChild size="sm" className="rounded-full bg-primary hover:bg-primary/90">
            <Link to="/auth">
              Start Free <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 mb-6"
          >
            The Hara Journal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl text-foreground mb-6"
          >
            <span className="font-light">Thoughts on </span>
            <span className="font-cormorant italic font-light text-accent">intuition</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Essays on trusting yourself, the science of gut feelings, and the art of making decisions that feel right.
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-6 mb-16">
        <div className="max-w-5xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gradient-to-br from-primary/8 via-secondary/10 to-accent/8 border border-border/30 rounded-3xl p-8 md:p-12 cursor-pointer group"
            onClick={() => document.getElementById(blogPosts[0].id)?.scrollIntoView({ behavior: "smooth" })}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs tracking-wider uppercase text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                Featured
              </span>
              <span className="text-xs text-muted-foreground">{blogPosts[0].category}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-light text-foreground mb-4 group-hover:text-primary/90 transition-colors leading-tight">
              {blogPosts[0].title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
              {blogPosts[0].excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground/70">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {blogPosts[0].readTime}
              </span>
              <span>{blogPosts[0].date}</span>
            </div>
          </motion.article>
        </div>
      </section>

      {/* All Posts */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                id={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="border-b border-border/20 pb-12 last:border-0"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs tracking-wider uppercase text-accent/80 bg-accent/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-3xl font-light text-foreground mb-4 leading-tight">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-3xl font-light italic">
                  {post.excerpt}
                </p>

                {/* Content */}
                <div className="space-y-5 max-w-3xl">
                  {post.content.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm md:text-base text-foreground/80 leading-relaxed font-light"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/10 via-secondary/15 to-accent/10 border border-border/30 rounded-3xl p-10 md:p-14 text-center"
          >
            <h3 className="text-2xl md:text-3xl text-foreground mb-4">
              <span className="font-light">Ready to start </span>
              <span className="font-cormorant italic text-accent">listening</span>
              <span className="font-light">?</span>
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base">
              Your intuition has been trying to tell you something. Hara helps you hear it.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full text-base px-8 py-6 shadow-lg shadow-primary/20"
            >
              <Link to="/auth">
                Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/about" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Hara
          </Link>
          <p className="text-sm text-muted-foreground">© 2026 Hara. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
