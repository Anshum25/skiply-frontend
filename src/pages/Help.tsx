import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Book,
  Users,
  Building2,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { faqData, searchFAQ, FAQItem } from "../data/faqData";
import SkiplyBot from "../components/Chatbot/SkiplyBot";

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const categories = [
    { id: "all", label: "All Topics", icon: HelpCircle, count: faqData.length },
    {
      id: "general",
      label: "General",
      icon: HelpCircle,
      count: faqData.filter((f) => f.category === "general").length,
    },
    {
      id: "booking",
      label: "Booking",
      icon: Book,
      count: faqData.filter((f) => f.category === "booking").length,
    },
    {
      id: "account",
      label: "Account",
      icon: Users,
      count: faqData.filter((f) => f.category === "account").length,
    },
    {
      id: "business",
      label: "Business",
      icon: Building2,
      count: faqData.filter((f) => f.category === "business").length,
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: CreditCard,
      count: faqData.filter((f) => f.category === "pricing").length,
    },
    {
      id: "technical",
      label: "Technical",
      icon: Settings,
      count: faqData.filter((f) => f.category === "technical").length,
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchFAQ(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const getFilteredFAQs = (): FAQItem[] => {
    if (searchResults.length > 0 && searchQuery.trim()) {
      return searchResults;
    }

    if (selectedCategory === "all") {
      return faqData;
    }

    return faqData.filter((faq) => faq.category === selectedCategory);
  };

  const popularFAQs = faqData.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How Can We{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Help You?
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about Skiply, or chat with our AI
            assistant for personalized help.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for help topics, features, or questions..."
              className="pl-12 pr-4 py-4 text-lg rounded-2xl border-0 bg-white dark:bg-gray-800 shadow-lg"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => handleSearch("")}
              >
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get instant answers from our AI-powered chatbot
                </p>
                <Button
                  onClick={() => setShowChatbot(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
                >
                  Start Chatting
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Contact our support team via email
                </p>
                <Button
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.open("mailto:support@skiply.com")}
                >
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Speak directly with our support team
                </p>
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => window.open("tel:+1-555-SKIPLY")}
                >
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "ghost"
                    }
                    className="w-full justify-between h-auto py-3"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Popular Questions (when no search) */}
            {!searchQuery && selectedCategory === "all" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="w-5 h-5" />
                      <span>Popular Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {popularFAQs.map((faq) => (
                        <Button
                          key={faq.id}
                          variant="outline"
                          className="h-auto p-4 text-left justify-start"
                          onClick={() => {
                            setSelectedCategory(faq.category);
                            setSearchQuery(faq.question);
                            handleSearch(faq.question);
                          }}
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {faq.question}
                            </p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Search Results or Category FAQs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : selectedCategory === "all"
                        ? "All Questions"
                        : `${categories.find((c) => c.id === selectedCategory)?.label} Questions`}
                  </CardTitle>
                  {getFilteredFAQs().length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {getFilteredFAQs().length} question
                      {getFilteredFAQs().length !== 1 ? "s" : ""} found
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {getFilteredFAQs().length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-2">
                      {getFilteredFAQs().map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border rounded-lg px-4"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-start justify-between w-full pr-4">
                              <span className="font-medium">
                                {faq.question}
                              </span>
                              <Badge variant="outline" className="ml-4 text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 dark:text-gray-300 pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-12">
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No results found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Try adjusting your search terms or browse different
                        categories
                      </p>
                      <Button onClick={() => setShowChatbot(true)}>
                        Ask AI Assistant
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Our support team is available 24/7 to assist you with any
                questions or issues you may have.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setShowChatbot(true)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with AI
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => window.open("mailto:support@skiply.com")}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <SkiplyBot onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </div>
  );
};

export default Help;
