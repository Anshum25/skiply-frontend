export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category:
    | "general"
    | "booking"
    | "business"
    | "account"
    | "technical"
    | "pricing";
}

export const faqData: FAQItem[] = [
  // General Questions
  {
    id: "what-is-skiply",
    question: "What is Skiply?",
    answer:
      "Skiply is a smart queue management platform that allows you to book your spot in queues remotely. Skip the wait at hospitals, salons, banks, restaurants, and government offices by booking your appointment in advance.",
    keywords: ["what", "skiply", "platform", "queue", "management", "about"],
    category: "general",
  },
  {
    id: "how-it-works",
    question: "How does Skiply work?",
    answer:
      "Skiply works in 3 simple steps: 1) Search for businesses near you, 2) Book your spot in the queue, 3) Arrive when it's your turn. You'll receive real-time updates about your queue position and estimated wait time.",
    keywords: ["how", "works", "process", "steps", "book", "queue"],
    category: "general",
  },
  {
    id: "supported-businesses",
    question: "What types of businesses are supported?",
    answer:
      "Skiply supports various business types including hospitals, clinics, beauty salons, banks, restaurants, government offices, pharmacies, dental clinics, eye care centers, gyms, auto service centers, and legal services.",
    keywords: ["businesses", "types", "supported", "categories", "services"],
    category: "general",
  },
  {
    id: "is-free",
    question: "Is Skiply free to use?",
    answer:
      "Yes! Skiply is completely free for users. You can browse businesses, book appointments, and track your queue position without any charges. Some premium services may have optional fees set by individual businesses.",
    keywords: ["free", "cost", "price", "charge", "money", "payment"],
    category: "pricing",
  },

  // Booking Questions
  {
    id: "how-to-book",
    question: "How do I book an appointment?",
    answer:
      "To book an appointment: 1) Search for a business or service, 2) Select your preferred time slot, 3) Fill in your details, 4) Confirm your booking. You'll receive a confirmation with your token number and estimated wait time.",
    keywords: ["book", "appointment", "reservation", "schedule", "how"],
    category: "booking",
  },
  {
    id: "cancel-booking",
    question: "Can I cancel my booking?",
    answer:
      'Yes, you can cancel your booking anytime before your scheduled time. Go to "My Bookings" in your profile, find the booking you want to cancel, and click the cancel button. Please cancel at least 30 minutes before your appointment to avoid any penalties.',
    keywords: ["cancel", "cancellation", "booking", "appointment", "refund"],
    category: "booking",
  },
  {
    id: "reschedule-booking",
    question: "Can I reschedule my appointment?",
    answer:
      'Yes, you can reschedule your appointment based on availability. Visit your booking details and select "Reschedule" to choose a new time slot. Please note that rescheduling is subject to business availability.',
    keywords: ["reschedule", "change", "time", "appointment", "modify"],
    category: "booking",
  },
  {
    id: "no-show",
    question: "What happens if I don't show up?",
    answer:
      "If you don't show up for your appointment without canceling, it may be marked as a \"no-show\". Repeated no-shows might affect your ability to book future appointments with some businesses. We recommend canceling if you can't make it.",
    keywords: ["no-show", "miss", "appointment", "skip", "dont show"],
    category: "booking",
  },
  {
    id: "advance-booking",
    question: "How far in advance can I book?",
    answer:
      "Booking windows vary by business. Most allow bookings up to 30 days in advance, while some accept same-day bookings only. Check the specific business page for their advance booking policy.",
    keywords: ["advance", "booking", "days", "future", "how far"],
    category: "booking",
  },

  // Account Questions
  {
    id: "create-account",
    question: "Do I need an account to use Skiply?",
    answer:
      "Yes, you need to create a free account to book appointments and track your queue position. This helps us provide personalized service and maintain your booking history.",
    keywords: ["account", "register", "signup", "create", "need"],
    category: "account",
  },
  {
    id: "forgot-password",
    question: "I forgot my password. How do I reset it?",
    answer:
      'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
    keywords: ["forgot", "password", "reset", "recover", "login"],
    category: "account",
  },
  {
    id: "update-profile",
    question: "How do I update my profile information?",
    answer:
      'Go to your profile page by clicking on your avatar in the top right corner, then select "Profile Settings". You can update your name, email, phone number, and notification preferences.',
    keywords: ["update", "profile", "edit", "information", "details"],
    category: "account",
  },
  {
    id: "notifications",
    question: "How do I manage notifications?",
    answer:
      "You can manage your notification preferences in your profile settings. Choose to receive updates via email, SMS, or push notifications for booking confirmations, queue updates, and reminders.",
    keywords: ["notifications", "alerts", "email", "sms", "push", "settings"],
    category: "account",
  },

  // Business Questions
  {
    id: "list-business",
    question: "How can I list my business on Skiply?",
    answer:
      'To list your business, click "For Businesses" and complete the registration form. You\'ll need to provide business details, operating hours, and services offered. Our team will review and approve your application within 2-3 business days.',
    keywords: ["list", "business", "register", "add", "partner", "join"],
    category: "business",
  },
  {
    id: "business-cost",
    question: "How much does it cost for businesses?",
    answer:
      "Skiply offers flexible pricing plans for businesses. We have a free tier for small businesses and affordable premium plans with advanced features. Contact our business team for detailed pricing information.",
    keywords: ["business", "cost", "price", "fee", "subscription", "plan"],
    category: "business",
  },
  {
    id: "manage-bookings",
    question: "How do businesses manage bookings?",
    answer:
      "Businesses get access to a comprehensive dashboard where they can view, confirm, reschedule, or cancel bookings. They can also set their availability, manage queue capacity, and track analytics.",
    keywords: ["manage", "bookings", "business", "dashboard", "admin"],
    category: "business",
  },

  // Technical Questions
  {
    id: "mobile-app",
    question: "Is there a mobile app?",
    answer:
      "Skiply is built as a progressive web app (PWA) that works seamlessly on all devices. You can add it to your home screen for a native app-like experience. Dedicated mobile apps are coming soon!",
    keywords: ["mobile", "app", "download", "ios", "android", "phone"],
    category: "technical",
  },
  {
    id: "browser-support",
    question: "Which browsers are supported?",
    answer:
      "Skiply works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser.",
    keywords: ["browser", "support", "chrome", "firefox", "safari", "edge"],
    category: "technical",
  },
  {
    id: "real-time-updates",
    question: "How do real-time updates work?",
    answer:
      "Skiply uses advanced technology to provide live queue position updates. You'll receive notifications when your turn is approaching, allowing you to time your arrival perfectly.",
    keywords: [
      "real-time",
      "updates",
      "live",
      "queue",
      "position",
      "notifications",
    ],
    category: "technical",
  },
  {
    id: "data-security",
    question: "Is my data secure?",
    answer:
      "Yes, we take data security seriously. All your personal information is encrypted and stored securely. We follow industry best practices and comply with data protection regulations to keep your information safe.",
    keywords: [
      "security",
      "data",
      "privacy",
      "safe",
      "encrypted",
      "protection",
    ],
    category: "technical",
  },

  // Support Questions
  {
    id: "contact-support",
    question: "How do I contact support?",
    answer:
      "You can reach our support team via email at support@skiply.com, through the chat feature on our website, or by calling our helpline. We're available 24/7 to assist you.",
    keywords: ["contact", "support", "help", "customer service", "assistance"],
    category: "general",
  },
  {
    id: "refund-policy",
    question: "What is your refund policy?",
    answer:
      "Since Skiply is free for users, refunds typically apply to any premium services or fees charged by businesses. Each business sets their own refund policy, which you can view when booking.",
    keywords: ["refund", "policy", "money back", "cancellation", "fee"],
    category: "pricing",
  },
  {
    id: "wait-time-accuracy",
    question: "How accurate are the wait times?",
    answer:
      "Our AI-powered system provides highly accurate wait time predictions based on real-time data, historical patterns, and current queue status. Accuracy is typically within 5-10 minutes for most services.",
    keywords: ["wait time", "accuracy", "prediction", "estimate", "precise"],
    category: "technical",
  },
  {
    id: "multiple-bookings",
    question: "Can I book multiple appointments?",
    answer:
      "Yes, you can book multiple appointments for different services or time slots. However, you cannot book overlapping time slots at the same business to ensure fairness for all users.",
    keywords: ["multiple", "bookings", "appointments", "several", "many"],
    category: "booking",
  },
];

// Helper function to search FAQ
export const searchFAQ = (query: string): FAQItem[] => {
  if (!query.trim()) return [];

  const queryWords = query.toLowerCase().split(" ");
  const results: { item: FAQItem; score: number }[] = [];

  faqData.forEach((item) => {
    let score = 0;

    // Check question match
    queryWords.forEach((word) => {
      if (item.question.toLowerCase().includes(word)) {
        score += 3;
      }
      if (item.answer.toLowerCase().includes(word)) {
        score += 1;
      }
      if (item.keywords.some((keyword) => keyword.includes(word))) {
        score += 2;
      }
    });

    if (score > 0) {
      results.push({ item, score });
    }
  });

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((result) => result.item);
};

// Get suggested questions for category
export const getSuggestedQuestions = (category?: string): FAQItem[] => {
  if (category) {
    return faqData.filter((item) => item.category === category).slice(0, 4);
  }
  return faqData.slice(0, 6);
};

// Get random greeting message
export const getGreetingMessage = (): string => {
  const greetings = [
    "Hi! I'm your Skiply assistant. How can I help you today?",
    "Hello! I'm here to answer your questions about Skiply. What would you like to know?",
    "Welcome to Skiply! I can help you with booking, account questions, and more. Ask me anything!",
    "Hi there! I'm your AI assistant for Skiply. What can I help you with?",
    "Hello! Ready to skip the wait? Ask me anything about how Skiply works!",
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
};
