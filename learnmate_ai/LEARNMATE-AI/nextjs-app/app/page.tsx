"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenText, HelpCircle, MessageSquare, Loader2 } from "lucide-react";

// Types
type Flashcard = { term: string; definition: string };

type QuizItem = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function LearnMatePage() {
  const [active, setActive] = useState<"flashcards" | "quiz" | "studybuddy">("flashcards");

  // ===== Flashcards =====
  const [fcInput, setFcInput] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [fcLoading, setFcLoading] = useState(false);
  const [fcError, setFcError] = useState<string | null>(null);

  // ===== Quiz =====
  const [qInput, setQInput] = useState("");
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [qLoading, setQLoading] = useState(false);
  const [qError, setQError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  // ===== Study Buddy =====
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ------- API calls -------
  const runFlashcards = async () => {
    setFcError(null);
    setFcLoading(true);
    setFlashcards([]);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: fcInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate flashcards");
      setFlashcards(data.flashcards || []);
    } catch (e: any) {
      setFcError(e.message || "Failed to generate flashcards");
    } finally {
      setFcLoading(false);
    }
  };

  const runQuiz = async () => {
    setQError(null);
    setQLoading(true);
    setQuiz([]);
    setAnswers([]);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: qInput })  // quiz backend expects text key
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate quiz");
      setQuiz(data.quiz || []);
      setAnswers(new Array((data.quiz || []).length).fill(-1));
    } catch (e: any) {
      setQError(e.message || "Failed to generate quiz");
    } finally {
      setQLoading(false);
    }
  };

  const chooseAnswer = (qi: number, optIndex: number) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[qi] = optIndex;
      return copy;
    });
  };

  const sendChat = async () => {
    const content = chatInput.trim();
    if (!content) return;
    const next = [...messages, { role: "user", content } as ChatMsg];
    setMessages(next);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/studybuddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: content, history: next })  // assuming notes key expected
      });
      const data = await res.json();
      const reply = data?.reply || data?.message || data?.response || "(no reply)";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "(error talking to Study Buddy)" }]);
    } finally {
      setChatLoading(false);
    }
  };

  // ------- UI helpers -------
  const NavItem = ({
    id,
    label,
    icon: Icon,
  }: {
    id: typeof active;
    label: string;
    icon: React.ElementType;
  }) => (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition border
        ${active === id ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-200"}`}
      aria-current={active === id ? "page" : undefined}
    >
      <Icon className={"w-5 h-5"} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50">
      {/* Optional top banner (remove if unused) */}
      {/* <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: "url(/study-banner.jpg)" }} /> */}

      <div className="h-full flex">
        {/* Sidebar */}
        <aside className="w-72 h-full bg-white border-r border-gray-200 p-5 flex flex-col gap-3">
          <div className="mb-2">
            <div className="text-2xl font-extrabold tracking-tight">LearnMate <span className="text-blue-600">AI</span></div>
            <p className="text-xs text-gray-500 mt-1">Flashcards • Quiz • Study Buddy</p>
          </div>

          <NavItem id="flashcards" label="Flashcards" icon={BookOpenText} />
          <NavItem id="quiz" label="Create Quiz" icon={HelpCircle} />
          <NavItem id="studybuddy" label="Study Buddy" icon={MessageSquare} />

          <div className="mt-auto text-xs text-gray-400">
            <p>Local model via Ollama</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 h-full overflow-y-auto p-6">
          {/* Flashcards */}
          {active === "flashcards" && (
            <section>
              <h2 className="text-2xl font-bold mb-2">Flashcard Generator</h2>
              <p className="text-sm text-gray-600 mb-4">Enter a topic or paste notes. You’ll get 10 concise cards.</p>

              <Card className="rounded-2xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <Textarea
                      value={fcInput}
                      onChange={(e) => setFcInput(e.target.value)}
                      placeholder="e.g., Operating Systems: CPU scheduling, deadlocks, memory management..."
                      className="min-h-[120px]"
                    />
                    <div className="flex md:flex-col gap-2 md:w-52">
                      <Button onClick={runFlashcards} disabled={fcLoading} className="w-full">
                        {fcLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating</>) : "Generate"}
                      </Button>
                      <Button variant="secondary" onClick={() => { setFlashcards([]); setFcInput(""); }} className="w-full">Clear</Button>
                    </div>
                  </div>

                  {fcError && <div className="text-red-600 text-sm mb-3">{fcError}</div>}

                  {!!flashcards.length && (
                    <div className="grid md:grid-cols-2 gap-3">
                      {flashcards.map((c, i) => (
                        <div key={i} className="group perspective">
                          <div className="relative h-full">
                            <div className="border rounded-xl p-4 shadow-sm bg-white">
                              <div className="font-semibold mb-1">{c.term}</div>
                              <div className="text-sm text-gray-700">{c.definition}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Quiz */}
          {active === "quiz" && (
            <section>
              <h2 className="text-2xl font-bold mb-2">Quiz Creator</h2>
              <p className="text-sm text-gray-600 mb-4">Paste content; get MCQs with explanations. Click an option to check.</p>

              <Card className="rounded-2xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <Textarea
                      value={qInput}
                      onChange={(e) => setQInput(e.target.value)}
                      placeholder="Paste a passage or bullet notes here..."
                      className="min-h-[120px]"
                    />
                    <div className="flex md:flex-col gap-2 md:w-52">
                      <Button onClick={runQuiz} disabled={qLoading} className="w-full">
                        {qLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating</>) : "Generate"}
                      </Button>
                      <Button variant="secondary" onClick={() => { setQuiz([]); setAnswers([]); setQInput(""); }} className="w-full">Clear</Button>
                    </div>
                  </div>

                  {qError && <div className="text-red-600 text-sm mb-3">{qError}</div>}

                  {!!quiz.length && (
                    <ol className="space-y-4">
                      {quiz.map((q, qi) => (
                        <li key={qi} className="border rounded-xl p-4 bg-white">
                          <div className="font-semibold mb-2">{qi + 1}. {q.question}</div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {q.options.map((opt: string, oi: number) => {
                              const chosen = answers[qi];
                              const isCorrect = oi === q.correct;
                              const isChosen = chosen === oi;
                              const show = chosen !== -1;
                              return (
                                <Button
                                  key={oi}
                                  onClick={() => chooseAnswer(qi, oi)}
                                  variant={"secondary"}
                                  className={`justify-start h-auto py-3 px-4 text-left border
                                    ${show && isCorrect ? "border-green-600 bg-green-50" : ""}
                                    ${show && isChosen && !isCorrect ? "border-red-600 bg-red-50" : ""}`}
                                >
                                  {opt}
                                </Button>
                              );
                            })}
                          </div>
                          {answers[qi] !== -1 && (
                            <div className={`mt-3 text-sm ${answers[qi] === q.correct ? "text-green-700" : "text-red-700"}`}>
                              {answers[qi] === q.correct ? "✅ Correct!" : `❌ Incorrect. Correct answer: ${q.options[q.correct]}`}
                              <div className="text-gray-700 mt-1">{q.explanation}</div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Study Buddy */}
          {active === "studybuddy" && (
            <section className="h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-2">Study Buddy</h2>
              <p className="text-sm text-gray-600 mb-4">Ask anything. Your local AI will help.</p>

              <Card className="flex-1 rounded-2xl flex flex-col min-h-[60vh]">
                <CardContent className="p-0 flex flex-col h-full">
                  <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-white rounded-t-2xl">
                    {messages.map((m, i) => (
                      <div key={i} className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm text-sm leading-relaxed ${m.role === "user" ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-gray-100"}`}>
                        {m.content}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="max-w-[80%] mr-auto bg-gray-100 rounded-2xl px-4 py-2 text-sm text-gray-600 inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking...
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={(e) => { e.preventDefault(); sendChat(); }}
                    className="p-3 border-t bg-gray-50 rounded-b-2xl flex gap-2"
                  >
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything about your topic..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={chatLoading || !chatInput.trim()}>Send</Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
