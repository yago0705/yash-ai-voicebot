"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async (q: string) => {
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
      window.speechSynthesis.speak(speech);
    } catch (err) {
      setAnswer("Something went wrong.");
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

      askQuestion(text);
    };
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold mb-4">
        Talk To Yash AI
      </h1>

      <p className="text-center max-w-xl mb-8">
        Ask me anything about my journey, strengths,
        failures, career goals, AI, family, hobbies
        or life experiences.
      </p>

      <button
        onClick={startVoice}
        className="bg-black text-white px-8 py-4 rounded-xl text-lg"
      >
        🎤 Start Talking
      </button>

      {loading && (
        <p className="mt-6">Thinking...</p>
      )}

      {question && (
        <div className="mt-8 max-w-2xl w-full">
          <h3 className="font-bold">
            Your Question
          </h3>

          <p className="mb-4">
            {question}
          </p>

          <h3 className="font-bold">
            Yash AI
          </h3>

          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}
