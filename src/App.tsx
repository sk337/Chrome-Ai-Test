import { useState, useRef } from "react";
import { ChromeAIChatLanguageModel, chromeai } from "chrome-ai";
const { text } = await generateText({
  model: chromeai(),
  prompt: 'Who are you?',
});
import "./index.css";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import gemini from "@/assets/gemini.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  author: "User" | "Bot";
  text: string;
}

const TestMessages: Message[] = [
  {
    author: "User",
    text: "Hello",
  },
  {
    author: "Bot",
    text: "how may i help you",
  },
];

function App() {
  document.body.className = "dark";
  const model = useRef<ChromeAIChatLanguageModel>(chromeai("generic"));
  const [messages, setMessages] = useState<Message[]>(TestMessages);
  const [input, setInput] = useState("");
  return (
    <main className="h-full w-full flex flex-col pb-5">
      <div className="p-5 w-full flex flex-row justify between">
        <div className="flex flex-row items-center gap-10">
          <Menu />
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
        <div className="overflox-x-auto">
          {messages.map((message, index) => {
            if (message.author === "User") {
              return (
                <div key={index} className="flex flex-row justify-end">
                  <div className="bg-blue-700 rounded-lg p-3">
                    {message.text}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="flex flex-row justify-start">
                  <div className="bg-gray-700 rounded-lg p-3">
                    {message.text}
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="flex flex-row gap-5">
          <Input
            type="text"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Message Gemini Nano..."
          />
          <Button
            variant="outline"
            onClick={async (e) => {
              e.preventDefault();
              model.
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;
