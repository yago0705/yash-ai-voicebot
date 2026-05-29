"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async (q: string) => {
    if (!q.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: q,
        }),
      });

      const data = await res.json();

      setAnswer(data.answer);

      const speech = new SpeechSynthesisUtterance(data.answer);
      speech.rate = 1;
      speech.pitch = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    } catch (err) {
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;

      setQuestion(text);
      setInput(text);

      askQuestion(text);
    };
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-black text-white">
      <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-3xl font-bold mb-6">
        YG
      </div>

      <h1 className="text-5xl font-bold text-center mb-4">
        Yash AI – Interactive Voice Interview
      </h1>

      <p className="text-center max-w-2xl mb-8 text-gray-300">
        Ask me anything about my journey, career, failures,
        ambitions, AI, strengths, goals, hobbies or life experiences.
      </p>

      <button
        onClick={startVoice}
        className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition"
      >
        🎤 Start Talking
      </button>

      <div className="mt-6 text-center">
        <p className="font-semibold mb-2">
          Try asking:
        </p>

        <div className="space-y-1 text-sm text-gray-300">
          <p>• Tell me about yourself</p>
          <p>• What motivates you?</p>
          <p>• What's your biggest failure?</p>
          <p>• Why AI?</p>
          <p>• What's your superpower?</p>
          <p>• Where do you see yourself in 5 years?</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="px-4 py-3 rounded-lg text-black w-80"
        />

        <button
          onClick={() => {
            setQuestion(input);
            askQuestion(input);
          }}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          Ask
        </button>
      </div>

      {loading && (
        <div className="mt-6">
          <p className="animate-pulse text-gray-300">
            🤔 Thinking...
          </p>
        </div>
      )}

      {question && (
        <div className="mt-10 max-w-3xl w-full bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <h3 className="font-bold text-lg mb-2">
            Your Question
          </h3>

          <p className="mb-6 text-gray-300">
            {question}
          </p>

          <h3 className="font-bold text-lg mb-2">
            Yash AI
          </h3>

          <p className="leading-8 text-gray-200">
            {answer}
          </p>
        </div>
      )}

      <footer className="mt-12 text-sm text-gray-500">
        Built by Yash Goyal for the AI Engineer Assessment
      </footer>
    </main>
  );
}