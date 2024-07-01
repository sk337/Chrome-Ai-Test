import { useState } from "react";
import { ChromeAIChatSettings, chromeai } from "chrome-ai";
import { CoreMessage, streamText } from "ai";
import { MemoizedReactMarkdown } from "./markdown";
import "./index.css";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import gemini from "@/assets/gemini.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "./md.css";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Settings: ChromeAIChatSettings = {
  temperature: 0.5,
  topK: 50,
  safetySettings: [
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
};

// const systemPrompt = "you are a helpful ai";
// const introPrompt = "**Hello**, I am Gemini Nano. How can I help you today?";

function App() {
  document.body.className = "dark";
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "you are a helpful ai"
  );
  const [introPrompt, setIntroPrompt] = useState<string>(
    "**Hello**, I am Gemini Nano. How can I help you today?"
  );
  const [messages, setMessages] = useState<CoreMessage[]>([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "assistant",
      content: introPrompt,
    },
  ]);
  const [input, setInput] = useState("");

  async function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    // scrollToBottom();
    e.preventDefault();
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];

    if (!input) {
      newMessages.pop();
    }

    setInput("");
    setMessages(newMessages);

    try {
      const { textStream } = await streamText({
        model: chromeai("text", Settings),
        // system: "Complete the conversation as if you were the model!",
        prompt: newMessages.slice(-1)[0].content as string,
      });
      for await (const textPart of textStream) {
        setMessages([...newMessages, { role: "assistant", content: textPart }]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <main className="h-full w-full flex flex-col pb-5">
      <div className="p-5 w-full flex flex-row justify between">
        <div className="flex flex-row items-center gap-10">
          <motion.div whileHover={{ scale: 1.2, rotateX: 50 }}>
            <Menu className="hover:cursor-pointer" />
          </motion.div>
          <div className="flex flex-row gap-3">
            <Avatar>
              <AvatarImage src={gemini} />
              <AvatarFallback>GM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>Gemini Nano</span>
              <span className="text-xs text-gray-500">@Google</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full flex flex-col justify-between pl-64 pr-64">
        <div className="overflox-x-auto flex flex-col gap-5">
          {messages.map((message, index) => {
            if (message.role === "user") {
              return (
                <div key={index} className="flex flex-row gap-4 justify-end">
                  <div className="bg-blue-700 rounded-lg p-3">
                    <MemoizedReactMarkdown className={"prose"}>
                      {/* @ts-expect-error - wrong types */}
                      {message.content}
                    </MemoizedReactMarkdown>
                  </div>
                  <Avatar>
                    <AvatarImage src={gemini} />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </div>
              );
            } else if (message.role === "assistant") {
              return (
                <div className="flex flex-col text-gray-500 gap-2">
                  <div className="flex gap-3 flex-row">
                    Gemini{" "}
                    <Badge className="bg-gray-800 text-gray-400">
                      Local Ai
                    </Badge>
                  </div>
                  <div
                    key={index}
                    className="flex flex-row gap-4 justify-start"
                  >
                    <Avatar>
                      <AvatarImage src={gemini} />
                      <AvatarFallback>GM</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-700 text-white rounded-lg p-3">
                      <MemoizedReactMarkdown className={"prose"}>
                        {/* @ts-expect-error - wrong types */}
                        {message.content}
                      </MemoizedReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="flex flex-row gap-2">
          <Input
            type="text"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={input}
            placeholder="Message Gemini Nano..."
          />
          <motion.div whileHover={{ scale: 1.2, rotateX: -30 }}>
            <Button variant="outline" onClick={handleSubmit}>
              Send
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default App;
