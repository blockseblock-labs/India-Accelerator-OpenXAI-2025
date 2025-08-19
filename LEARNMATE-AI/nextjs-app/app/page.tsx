'use client';
import { useState } from 'react';

type Flashcard = { front: string; back: string };
type QuizQuestion = { question: string; choices: string[]; answerIndex: number; explanation?: string };

export default function Home() {
  const [activeTab, setActiveTab] = useState<'flashcards'|'quiz'|'buddy'>('flashcards');

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button className={"btn " + (activeTab==='flashcards' ? 'btn-primary' : '')} onClick={() => setActiveTab('flashcards')}>🃏 Flashcard Maker</button>
          <button className={"btn " + (activeTab==='quiz' ? 'btn-primary' : '')} onClick={() => setActiveTab('quiz')}>📝 Quiz Maker</button>
          <button className={"btn " + (activeTab==='buddy' ? 'btn-primary' : '')} onClick={() => setActiveTab('buddy')}>🤖 Study Buddy</button>
        </div>
      </div>

      {activeTab === 'flashcards' && <FlashcardMaker key="flash" />}
      {activeTab === 'quiz' && <QuizMaker key="quiz" />}
      {activeTab === 'buddy' && <StudyBuddy key="buddy" />}
    </div>
  );
}

function FlashcardMaker() {
  const [input, setInput] = useState('Paste notes here...');
  const [cards, setCards] = useState<Flashcard[]>([]);

  async function generate() {
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const data = await res.json();
    setCards(data.flashcards || []);
  }

  return (
    <section className="card fade-enter">
      <h2 className="text-xl font-semibold">Flashcard Maker</h2>
      <textarea className="input h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="mt-3 flex gap-2">
        <button className="btn btn-primary" onClick={generate}>Generate Flashcards</button>
        <button className="btn" onClick={() => setCards([])}>Clear</button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {cards.map((c,i)=>(
          <div key={i} className="card">
            <p className="font-medium">{c.front}</p>
            <p className="text-sm text-gray-500 mt-2">{c.back}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuizMaker() {
  const [input, setInput] = useState('Paste text to quiz...');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  async function generate() {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const data = await res.json();
    setQuiz(data.quiz || []);
    setAnswers([]);
  }

  return (
    <section className="card fade-enter">
      <h2 className="text-xl font-semibold">Quiz Maker</h2>
      <textarea className="input h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="mt-3">
        <button className="btn btn-primary" onClick={generate}>Create Quiz</button>
      </div>
      <div className="mt-4 space-y-6">
        {quiz.map((q,i)=>(
          <div key={i} className="card">
            <p className="font-medium">{q.question}</p>
            <ul className="mt-2 space-y-1">
              {q.choices.map((ch,j)=>(
                <li key={j}>
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`q-${i}`} onChange={()=>{
                      const newAns=[...answers]; newAns[i]=j; setAnswers(newAns);
                    }} />
                    {ch}
                  </label>
                </li>
              ))}
            </ul>
            {answers[i]!==undefined && (
              <p className="mt-2 text-sm">
                {answers[i]===q.answerIndex ? '✅ Correct' : '❌ Wrong'} {q.explanation && `- ${q.explanation}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function StudyBuddy() {
  const [messages, setMessages] = useState<{role:string; content:string}[]>([]);
  const [input, setInput] = useState('');

  async function send() {
    const newMsgs = [...messages, {role:'user', content:input}];
    setMessages(newMsgs);
    setInput('');
    const res = await fetch('/api/study-buddy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages:newMsgs })
    });
    const data = await res.json();
    setMessages(m=>[...newMsgs, {role:'assistant', content:data.reply}]);
  }

  return (
    <section className="card fade-enter">
      <h2 className="text-xl font-semibold">Study Buddy</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto border p-3 rounded-xl bg-gray-50">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==='user' ? 'text-right' : 'text-left'}>
            <span className={m.role==='user' ? 'bg-gray-900 text-white px-3 py-1 rounded-xl inline-block' : 'bg-gray-200 px-3 py-1 rounded-xl inline-block'}>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="input flex-1" value={input} onChange={e=>setInput(e.target.value)} />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </section>
  );
}
