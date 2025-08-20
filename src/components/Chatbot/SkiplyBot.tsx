import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Minimize2,
  Maximize2,
  HelpCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  faqData,
  searchFAQ,
  getSuggestedQuestions,
  getGreetingMessage,
  FAQItem,
} from "../../data/faqData";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isTyping?: boolean;
}

interface SkiplyBotProps {
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const SkiplyBot: React.FC<SkiplyBotProps> = ({
  onClose,
  isMinimized = false,
  onToggleMinimize,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with greeting message
    const greeting = getGreetingMessage();
    const suggestions = getSuggestedQuestions().map((faq) => faq.question);

    setMessages([
      {
        id: "1",
        type: "bot",
        content: greeting,
        timestamp: new Date(),
        suggestions: suggestions.slice(0, 4),
      },
    ]);

    setSuggestedQuestions(suggestions);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (
    type: "user" | "bot",
    content: string,
    suggestions?: string[],
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      suggestions: type === "bot" ? suggestions : undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateTyping = async (duration: number = 1000) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const getBotResponse = (
    userInput: string,
  ): { content: string; suggestions?: string[] } => {
    const query = userInput.toLowerCase().trim();

    // Handle greetings
    if (
      [
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
      ].some((greeting) => query.includes(greeting))
    ) {
      return {
        content:
          "Hello! I'm here to help you with any questions about Skiply. You can ask me about booking appointments, managing your account, listing your business, or anything else!",
        suggestions: [
          "How do I book an appointment?",
          "What is Skiply?",
          "Is Skiply free?",
          "How do I cancel a booking?",
        ],
      };
    }

    // Handle thanks
    if (
      ["thank", "thanks", "thank you"].some((thanks) => query.includes(thanks))
    ) {
      return {
        content:
          "You're welcome! Is there anything else I can help you with regarding Skiply?",
        suggestions: [
          "How does Skiply work?",
          "What businesses are supported?",
          "Contact support",
        ],
      };
    }

    // Search FAQ
    const searchResults = searchFAQ(userInput);

    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];
      const otherSuggestions = searchResults
        .slice(1, 4)
        .map((faq) => faq.question);

      return {
        content: bestMatch.answer,
        suggestions:
          otherSuggestions.length > 0
            ? otherSuggestions
            : [
                "How do I book an appointment?",
                "What types of businesses are supported?",
                "How do I contact support?",
              ],
      };
    }

    // No match found
    const fallbackSuggestions = [
      "What is Skiply?",
      "How do I book an appointment?",
      "Is Skiply free to use?",
      "How do I contact support?",
    ];

    return {
      content:
        "I'm sorry, I couldn't find a specific answer to your question. Here are some common topics I can help you with, or you can try rephrasing your question.",
      suggestions: fallbackSuggestions,
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message
    addMessage("user", userMessage);

    // Simulate bot typing
    await simulateTyping(800);

    // Get and add bot response
    const response = getBotResponse(userMessage);
    addMessage("bot", response.content, response.suggestions);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    // Add user message
    addMessage("user", suggestion);

    // Simulate bot typing
    await simulateTyping(600);

    // Get and add bot response
    const response = getBotResponse(suggestion);
    addMessage("bot", response.content, response.suggestions);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    const greeting = getGreetingMessage();
    const suggestions = getSuggestedQuestions().map((faq) => faq.question);

    setMessages([
      {
        id: Date.now().toString(),
        type: "bot",
        content: greeting,
        timestamp: new Date(),
        suggestions: suggestions.slice(0, 4),
      },
    ]);

    setInputValue("");
    toast.success("Chat reset successfully!");
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggleMinimize}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      className="fixed bottom-2 right-2 md:bottom-4 md:right-4 w-[90vw] md:w-96 h-[75vh] md:h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Skiply Assistant</h3>
              <p className="text-blue-100 text-sm">AI-powered FAQ Bot</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="text-white hover:bg-white/20 p-2"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white hover:bg-white/20 p-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-2">
                  <Card
                    className={`${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-white dark:bg-gray-900"
                    } border-0 shadow-sm`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.type === "user"
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Quick suggestions:
                      </p>
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs h-auto py-2 px-3 mr-2 mb-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Skiply..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex space-x-1">
            <Badge variant="secondary" className="text-xs">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ Bot
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Powered by Skiply AI
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SkiplyBot;
