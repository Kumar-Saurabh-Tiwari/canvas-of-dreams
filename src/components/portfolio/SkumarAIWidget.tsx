import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, X, MessageSquare, Wrench } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { sendGroqMessage } from "@/lib/groq-chat";

const DATA_URL = "/skumar-ai.json";

type KnowledgeBase = {
  person: {
    displayName: string;
    shortName: string;
    site: string;
    title: string;
    tagline: string;
    location?: string;
  };
  education?: Array<{
    institution: string;
    institutionUrl?: string;
    degree?: string;
    focus?: string;
    year?: string;
    summary?: string;
  }>;
  highlights: {
    years: string;
    shipped: string;
    stack: string;
    mode: string;
  };
  quotes: string[];
  skills: string[];
  hobbies?: string[];
  systemSpecifications?: {
    primaryLaptop?: {
      processor?: string;
      ram?: string;
      storage?: string;
      graphics?: string;
      certification?: string;
    };
    secondaryPc?: {
      processor?: string;
      ram?: string;
      storage?: string;
      graphics?: string;
    };
    note?: string;
  };
  services: Array<{ title: string; summary: string; stack: string[] }>;
  projects: Array<{ title: string; year: string; stack: string }>;
  experience: Array<{ range: string; role: string; company: string; summary: string }>;
  contact: {
    email: string;
    mobile?: string;
    github: string;
    linkedin: string;
    twitter?: string;
    contactPage: string;
    portfolio: string;
  };
  personalNotes?: string[];
  suggestedQuestions: string[];
};

type ChatMessage = { role: "user" | "assistant"; content: string };

type ServiceFormState = {
  name: string;
  email: string;
  company: string;
  budget: string;
  helpType: string;
  externalHelp: boolean;
  notes: string;
};

const emptyForm: ServiceFormState = {
  name: "",
  email: "",
  company: "",
  budget: "",
  helpType: "Product build",
  externalHelp: false,
  notes: "",
};

function formatList(items: string[], limit = 8) {
  const list = items.slice(0, limit);
  const suffix = items.length > limit ? ` (+${items.length - limit} more)` : "";
  return `${list.join(", ")}${suffix}`;
}

function buildAnswer(question: string, kb: KnowledgeBase | null) {
  if (!kb) return "Loading the portfolio profile. Try again in a moment.";
  const q = question.toLowerCase();
  const tokens = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const education = kb.education?.[0];
  const specs = kb.systemSpecifications;
  const primary = specs?.primaryLaptop;
  const secondary = specs?.secondaryPc;

  const intents: Array<{ key: string; terms: string[]; reply: () => string }> = [
    {
      key: "contact",
      terms: ["contact", "email", "mail", "reach", "linkedin", "github", "connect"],
      reply: () => [
        `Contact ${kb.person.displayName}:`,
        `Email: ${kb.contact.email}`,
        kb.contact.mobile ? `Mobile: ${kb.contact.mobile}` : null,
        `GitHub: ${kb.contact.github}`,
        `LinkedIn: ${kb.contact.linkedin}`,
        kb.contact.twitter ? `Twitter: ${kb.contact.twitter}` : null,
        `Contact page: ${kb.contact.contactPage}`,
      ].join("\n"),
    },
    {
      key: "specs",
      terms: ["spec", "specs", "pc", "laptop", "system", "hardware", "machine", "setup"],
      reply: () => {
        if (!specs) return "System specs are not listed yet.";
        const lines = ["System specs:"];
        if (primary) {
          lines.push(
            `Primary laptop: ${primary.processor ?? ""} | ${primary.ram ?? ""} | ${primary.storage ?? ""} | ${primary.graphics ?? ""}`.trim(),
          );
          if (primary.certification) lines.push(`Certification: ${primary.certification}`);
        }
        if (secondary) {
          lines.push(
            `Secondary PC: ${secondary.processor ?? ""} | ${secondary.ram ?? ""} | ${secondary.storage ?? ""} | ${secondary.graphics ?? ""}`.trim(),
          );
        }
        if (specs.note) lines.push(specs.note);
        return lines.filter(Boolean).join("\n");
      },
    },
    {
      key: "hobbies",
      terms: ["hobby", "hobbies", "interests", "games", "gaming", "cricket", "fitness", "gym"],
      reply: () => {
        if (!kb.hobbies?.length) return "Hobbies are not listed yet.";
        return `Hobbies: ${kb.hobbies.join(", ")}`;
      },
    },
    {
      key: "family",
      terms: ["family", "support", "personal"],
      reply: () => kb.personalNotes?.[0] ?? "Personal notes are not listed yet.",
    },
    {
      key: "services",
      terms: ["service", "services", "offer", "hire", "work with", "collab", "help", "freelance"],
      reply: () => [
        "Services:",
        ...kb.services.map((s) => `- ${s.title}: ${s.summary}`),
      ].join("\n"),
    },
    {
      key: "projects",
      terms: ["project", "projects", "portfolio", "case", "case study", "work", "build"],
      reply: () => [
        "Recent projects:",
        ...kb.projects.map((p) => `- ${p.title} (${p.year}) - ${p.stack}`),
      ].join("\n"),
    },
    {
      key: "experience",
      terms: ["experience", "role", "roles", "company", "companies", "career", "background"],
      reply: () => [
        "Experience highlights:",
        ...kb.experience.map((x) => `- ${x.role} @ ${x.company} (${x.range})`),
      ].join("\n"),
    },
    {
      key: "availability",
      terms: ["availability", "available", "open", "freelance", "contract", "hire"],
      reply: () => `For availability and new projects, reach out at ${kb.contact.email}.`,
    },
    {
      key: "skills",
      terms: ["skill", "skills", "stack", "tech", "technology", "tools", "framework"],
      reply: () => `Core stack: ${formatList(kb.skills)}`,
    },
    {
      key: "education",
      terms: ["education", "study", "studied", "college", "university", "degree", "bca", "mcu"],
      reply: () => {
        if (!education) return "Education details are not available yet.";
        const parts = [
          `${education.degree ?? "Degree"} in ${education.focus ?? "Computer Programming"} (${education.year ?? ""})`.trim(),
          education.institution,
          education.summary ?? "",
        ].filter(Boolean);
        return `Education: ${parts.join(". ")}`;
      },
    },
    {
      key: "location",
      terms: ["location", "city", "state", "country", "where", "based", "live"],
      reply: () => `Location: ${kb.person.location ?? "Based in India."}`,
    },
    {
      key: "fullstack",
      terms: ["full stack", "end to end", "e2e", "frontend", "backend"],
      reply: () =>
        "End-to-end delivery: frontend in React/Next/Angular and backend in Node/Java with SQL/NoSQL databases.",
    },
    {
      key: "ai",
      terms: ["ai", "llm", "rag", "agent", "agents", "prompt", "vector", "evaluation", "eval"],
      reply: () => {
        const ai = kb.services.find((s) => s.title.toLowerCase().includes("ai"));
        if (ai) return `AI workflows: ${ai.summary} Stack: ${ai.stack.join(", ")}.`;
        return "AI workflows, RAG, and tool-use orchestration.";
      },
    },
    {
      key: "about",
      terms: ["name", "who", "about", "bio", "profile", "intro"],
      reply: () => `${kb.person.displayName} - ${kb.person.title}. ${kb.person.tagline}`,
    },
  ];

  const scored = intents
    .map((intent) => {
      const score = intent.terms.reduce((sum, term) => {
        if (term.includes(" ")) return q.includes(term) ? sum + 2 : sum;
        return tokens.includes(term) ? sum + 1 : sum;
      }, 0);
      return { intent, score };
    })
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score > 0 && scored[0].intent) {
    return scored[0].intent.reply();
  }

  return [
    "I might have missed that. I can help with education, location, services, projects, AI work, skills, or contact info.",
    `Try: ${kb.suggestedQuestions.slice(0, 3).join(" | ")}`,
  ].join("\n");
}

function buildProfileSummary(kb: KnowledgeBase | null) {
  if (!kb) return "";
  const lines = [
    `${kb.person.displayName} - ${kb.person.title}.`,
    kb.person.tagline,
    `Location: ${kb.person.location ?? "India"}.`,
    `Highlights: ${kb.highlights.years} years, ${kb.highlights.shipped} shipped, stack ${kb.highlights.stack}.`,
    `Skills: ${formatList(kb.skills, 12)}.`,
    kb.hobbies?.length ? `Hobbies: ${kb.hobbies.join(", ")}.` : "",
    `Services: ${kb.services.map((s) => s.title).join(", ")}.`,
    `Projects: ${kb.projects.slice(0, 5).map((p) => p.title).join(", ")}.`,
    `Contact: ${kb.contact.email} | ${kb.contact.github} | ${kb.contact.linkedin}.`,
    kb.contact.mobile ? `Mobile: ${kb.contact.mobile}.` : "",
    kb.contact.twitter ? `Twitter: ${kb.contact.twitter}.` : "",
    kb.systemSpecifications?.primaryLaptop
      ? `Primary laptop: ${kb.systemSpecifications.primaryLaptop.processor ?? ""}, ${kb.systemSpecifications.primaryLaptop.ram ?? ""}, ${kb.systemSpecifications.primaryLaptop.storage ?? ""}, ${kb.systemSpecifications.primaryLaptop.graphics ?? ""}.`
      : "",
    kb.systemSpecifications?.secondaryPc
      ? `Secondary PC: ${kb.systemSpecifications.secondaryPc.processor ?? ""}, ${kb.systemSpecifications.secondaryPc.ram ?? ""}, ${kb.systemSpecifications.secondaryPc.storage ?? ""}, ${kb.systemSpecifications.secondaryPc.graphics ?? ""}.`
      : "",
    kb.systemSpecifications?.note ?? "",
    kb.personalNotes?.[0] ?? "",
  ].filter(Boolean);

  return lines.join("\n");
}

export default function SkumarAIWidget() {
  const sendGroq = useServerFn(sendGroqMessage);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "service">("chat");
  const [loading, setLoading] = useState(true);
  const [knowledge, setKnowledge] = useState<KnowledgeBase | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ask me about skills, services, projects, or contact info." },
  ]);
  const [input, setInput] = useState("");
  const [form, setForm] = useState<ServiceFormState>(emptyForm);
  const [thinking, setThinking] = useState(false);
  const entryRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch(DATA_URL)
      .then((res) => res.json())
      .then((data: KnowledgeBase) => {
        if (!active) return;
        setKnowledge(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setKnowledge(null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const suggested = useMemo(() => knowledge?.suggestedQuestions ?? [], [knowledge]);
  const quickSuggestions = useMemo(() => {
    const base = [
      ...(knowledge?.suggestedQuestions ?? []),
      "Education",
      "Location",
      "End to end delivery",
      "Full stack experience",
      "BCA details",
      "University",
    ];
    const seen = new Set<string>();
    return base.filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [knowledge]);
  const typeahead = useMemo(() => {
    const value = input.trim().toLowerCase();
    if (!value) return [] as string[];
    return quickSuggestions
      .filter((item) => item.toLowerCase().includes(value))
      .slice(0, 4);
  }, [input, quickSuggestions]);

  useEffect(() => {
    if (!open || activeTab !== "chat") return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, activeTab, thinking]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateOffset = () => {
      const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      entryRef.current?.style.setProperty("--keyboard-offset", `${offset}px`);
    };

    updateOffset();
    viewport.addEventListener("resize", updateOffset);
    viewport.addEventListener("scroll", updateOffset);
    window.addEventListener("orientationchange", updateOffset);
    return () => {
      viewport.removeEventListener("resize", updateOffset);
      viewport.removeEventListener("scroll", updateOffset);
      window.removeEventListener("orientationchange", updateOffset);
    };
  }, []);

  const sendQuestion = async (question: string) => {
    const clean = question.trim();
    if (!clean) return;
    setThinking(true);
    setMessages((prev) => [...prev, { role: "user", content: clean }]);

    try {
      const profile = buildProfileSummary(knowledge);
      const history = messages.slice(-6);
      const result = await sendGroq({ data: { message: clean, history, profile } });
      const reply = result.reply?.trim() || buildAnswer(clean, knowledge);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const reply = buildAnswer(clean, knowledge);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } finally {
      setThinking(false);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    const question = input.trim();
    setInput("");
    void sendQuestion(question);
  };

  const onSendSuggestion = (text: string) => {
    setInput("");
    void sendQuestion(text);
  };

  const onSubmitService = (event: React.FormEvent) => {
    event.preventDefault();
    if (!knowledge) return;
    const body = [
      `Name: ${form.name || "N/A"}`,
      `Email: ${form.email || "N/A"}`,
      `Company: ${form.company || "N/A"}`,
      `Budget: ${form.budget || "N/A"}`,
      `Help Type: ${form.helpType}`,
      `External Help Needed: ${form.externalHelp ? "Yes" : "No"}`,
      "Notes:",
      form.notes || "N/A",
    ].join("\n");

    const mailto = `mailto:${knowledge.contact.email}?subject=Service%20Request%20from%20Portfolio&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setForm(emptyForm);
  };

  return (
    <div
      ref={entryRef}
      className="fixed z-[70] flex flex-col items-end gap-3 pointer-events-auto skumar-ai-entry"
    >
      {open ? (
        <div className="w-[92vw] max-w-md rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(15,23,42,0.5)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background">
                <Bot size={18} />
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs tracking-[0.3em] text-muted-foreground">SKUMAR AI</p>
                  <p className="text-xs text-foreground">Portfolio assistant</p>
                </div>
                <p className="text-[10px] tracking-[0.18em] text-sky-400">POWERED BY GROQ AI</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-foreground transition-colors"
              aria-label="Close Skumar AI"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex-1 rounded-full border px-3 py-1 text-[10px] tracking-[0.3em] ${
                activeTab === "chat" ? "border-foreground text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              CHAT
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("service")}
              className={`flex-1 rounded-full border px-3 py-1 text-[10px] tracking-[0.3em] ${
                activeTab === "service" ? "border-foreground text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              SERVICE
            </button>
          </div>

          {activeTab === "chat" ? (
            <div className="flex flex-col gap-4 px-4 py-4">
              <div
                className="max-h-[40vh] overflow-y-auto space-y-3 pr-2"
                style={{ overscrollBehavior: "contain" }}
                onWheel={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={`${msg.role}-${idx}`}
                    className={`rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "assistant"
                        ? "bg-secondary text-foreground"
                        : "bg-foreground text-background ml-auto"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {thinking && (
                  <div className="rounded-xl px-3 py-2 text-sm leading-relaxed bg-secondary text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-foreground/70" />
                      <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-foreground/70 [animation-delay:120ms]" />
                      <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-foreground/70 [animation-delay:240ms]" />
                      <span className="text-[11px] text-muted-foreground">Thinking...</span>
                    </span>
                  </div>
                )}
                {loading && (
                  <div className="text-xs text-muted-foreground">Loading profile data...</div>
                )}
                <div ref={chatEndRef} />
              </div>

              {suggested.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {suggested.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSendSuggestion(item)}
                      className="skumar-ai-pill px-2 py-0.5 text-[9px] tracking-[0.18em]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about skills, services, or work..."
                  className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90"
                  aria-label="Send question"
                >
                  <Send size={16} />
                </button>
              </form>
              {typeahead.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {typeahead.map((item) => (
                    <button
                      key={`typeahead-${item}`}
                      type="button"
                      onClick={() => onSendSuggestion(item)}
                      className="skumar-ai-pill px-2 py-0.5 text-[9px] tracking-[0.18em]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={onSubmitService} className="px-4 py-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Name"
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                />
                <input
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email"
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                />
                <input
                  value={form.company}
                  onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                  placeholder="Company"
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                />
                <input
                  value={form.budget}
                  onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
                  placeholder="Budget range (optional)"
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                />
                <select
                  value={form.helpType}
                  onChange={(event) => setForm((prev) => ({ ...prev, helpType: event.target.value }))}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
                >
                  <option>Product build</option>
                  <option>Frontend engineering</option>
                  <option>Backend architecture</option>
                  <option>AI workflows</option>
                  <option>Consulting</option>
                </select>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={form.externalHelp}
                    onChange={(event) => setForm((prev) => ({ ...prev, externalHelp: event.target.checked }))}
                    className="h-4 w-4"
                  />
                  External help or collaborators needed
                </label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Tell me about the project"
                  className="min-h-[90px] rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-xs tracking-[0.3em] text-background"
              >
                <Wrench size={14} />
                REQUEST SERVICE
              </button>
              <p className="text-[10px] text-muted-foreground">Submitting opens your email client with the request.</p>
            </form>
          )}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-foreground bg-foreground px-3 py-2 text-xs tracking-[0.3em] text-background shadow-[0_14px_40px_-18px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 transition skumar-ai-button"
        aria-label="Open Skumar AI"
      >
        {/* <MessageSquare size={16} /> */}
        <span className="skumar-ai-icon">
              <img src="/assets/artificial-intelligence.gif" alt="" />
        </span>
        <span>
          <span className="skumar-ai-label">Skumar</span> <span className="skumar-ai-accent">AI</span>
        </span>
      </button>
    </div>
  );
}
