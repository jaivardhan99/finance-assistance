import { useState } from "react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GeminiChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();
      const botMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error talking to GPT:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-[90vh] p-4 bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">🤖 Finance Assistant</h1>

      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-md px-4 py-2 rounded-lg ${
              msg.role === "user"
                ? "bg-indigo-100 self-end text-right"
                : "bg-white self-start text-left shadow"
            }`}
          >
            {msg.content}
          </motion.div>
        ))}
        {loading && (
          <div className="animate-pulse text-sm text-gray-400">Typing...</div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Ask about budgeting, investing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GeminiChatBot;
