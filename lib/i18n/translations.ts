export type Locale = "en" | "te" | "hi";

export const localeNames: Record<Locale, string> = {
  en: "English",
  te: "తెలుగు",
  hi: "हिन्दी",
};

export interface Translations {
  // Navigation
  nav: {
    home: string;
    sermons: string;
    events: string;
    ministries: string;
    give: string;
    blog: string;
    contact: string;
    giveNow: string;
  };
  // Hero
  hero: {
    welcome: string;
    headline1: string;
    headline2: string;
    subtext: string;
    watchSermons: string;
    learnMore: string;
  };
  // Sections
  sections: {
    latestSermons: string;
    recentMessages: string;
    viewAll: string;
    viewAllSermons: string;
    upcomingEvents: string;
    whatsComingUp: string;
    allEvents: string;
    ourMinistries: string;
    getInvolved: string;
    exploreMinistries: string;
    aboutUs: string;
    ourStory: string;
    partnerWithUs: string;
    giveToday: string;
    connectWithUs: string;
  };
  // Newsletter
  newsletter: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    subscribe: string;
    successTitle: string;
    successMessage: string;
  };
  // Common
  common: {
    weekly: string;
    readMore: string;
    by: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: "Home",
      sermons: "Sermons",
      events: "Events",
      ministries: "Ministries",
      give: "Give",
      blog: "Blog",
      contact: "Contact",
      giveNow: "Give Now",
    },
    hero: {
      welcome: "Welcome to Our Ministry",
      headline1: "Proclaiming the",
      headline2: "Gospel of Jesus Christ",
      subtext:
        "Fr. Yesudas Ministries reaches the unreached, heals the broken, and builds up the Body of Christ through the power of the Holy Spirit.",
      watchSermons: "Watch Sermons",
      learnMore: "Learn More",
    },
    sections: {
      latestSermons: "Latest Sermons",
      recentMessages: "Recent Messages",
      viewAll: "View All",
      viewAllSermons: "View All Sermons",
      upcomingEvents: "Upcoming Events",
      whatsComingUp: "What's Coming Up",
      allEvents: "All Events",
      ourMinistries: "Our Ministries",
      getInvolved: "Get Involved",
      exploreMinistries: "Explore All Ministries",
      aboutUs: "About Us",
      ourStory: "Our Story",
      partnerWithUs: "Partner With Us in Ministry",
      giveToday: "Give Today",
      connectWithUs: "Connect With Us",
    },
    newsletter: {
      title: "Stay Connected",
      subtitle:
        "Receive devotionals, ministry updates, and event reminders straight to your inbox. No spam — just encouragement.",
      namePlaceholder: "Your name (optional)",
      emailPlaceholder: "Your email address",
      subscribe: "Subscribe",
      successTitle: "You're subscribed!",
      successMessage: "Thank you. We'll be in touch with encouraging content.",
    },
    common: {
      weekly: "Weekly",
      readMore: "Read More",
      by: "By",
    },
  },

  te: {
    nav: {
      home: "హోమ్",
      sermons: "ప్రసంగాలు",
      events: "కార్యక్రమాలు",
      ministries: "సేవలు",
      give: "దానం",
      blog: "బ్లాగ్",
      contact: "సంప్రదించండి",
      giveNow: "ఇప్పుడు ఇవ్వండి",
    },
    hero: {
      welcome: "మా మంత్రిత్వ శాఖకు స్వాగతం",
      headline1: "యేసు క్రీస్తు",
      headline2: "సువార్తను ప్రకటిస్తున్నాం",
      subtext:
        "ఫాదర్ యేసుదాస్ మంత్రిత్వ శాఖ చేరుకోని వారిని చేరుకుంటుంది, విరిగిన వారిని స్వస్థపరుస్తుంది, మరియు పవిత్రాత్మ శక్తి ద్వారా క్రీస్తు శరీరాన్ని నిర్మిస్తుంది.",
      watchSermons: "ప్రసంగాలు చూడండి",
      learnMore: "మరింత తెలుసుకోండి",
    },
    sections: {
      latestSermons: "తాజా ప్రసంగాలు",
      recentMessages: "ఇటీవలి సందేశాలు",
      viewAll: "అన్నీ చూడండి",
      viewAllSermons: "అన్ని ప్రసంగాలు చూడండి",
      upcomingEvents: "రాబోయే కార్యక్రమాలు",
      whatsComingUp: "రాబోయేవి",
      allEvents: "అన్ని కార్యక్రమాలు",
      ourMinistries: "మా సేవలు",
      getInvolved: "పాల్గొనండి",
      exploreMinistries: "అన్ని సేవలు చూడండి",
      aboutUs: "మా గురించి",
      ourStory: "మా కథ",
      partnerWithUs: "సేవలో మాతో భాగస్వామ్యం",
      giveToday: "ఈ రోజు ఇవ్వండి",
      connectWithUs: "మాతో అనుసంధానం",
    },
    newsletter: {
      title: "అనుసంధానంలో ఉండండి",
      subtitle:
        "భక్తి వ్యాసాలు, సేవా నవీకరణలు మరియు కార్యక్రమ రిమైండర్‌లు మీ ఇన్‌బాక్స్‌కు నేరుగా అందుకోండి.",
      namePlaceholder: "మీ పేరు (ఐచ్ఛికం)",
      emailPlaceholder: "మీ ఇమెయిల్ చిరునామా",
      subscribe: "సభ్యత్వం పొందండి",
      successTitle: "సభ్యత్వం పొందారు!",
      successMessage: "ధన్యవాదాలు. మేము మీతో ప్రోత్సాహకర కంటెంట్‌తో సంప్రదిస్తాము.",
    },
    common: {
      weekly: "వారపు",
      readMore: "మరింత చదవండి",
      by: "రచన",
    },
  },

  hi: {
    nav: {
      home: "होम",
      sermons: "उपदेश",
      events: "कार्यक्रम",
      ministries: "सेवाएँ",
      give: "दान",
      blog: "ब्लॉग",
      contact: "संपर्क",
      giveNow: "अभी दान करें",
    },
    hero: {
      welcome: "हमारी सेवकाई में आपका स्वागत है",
      headline1: "यीशु मसीह का",
      headline2: "सुसमाचार प्रचार करते हैं",
      subtext:
        "फादर येसुदास मिनिस्ट्रीज अनछुए लोगों तक पहुँचती है, टूटे हुओं को चंगाई देती है, और पवित्र आत्मा की शक्ति से मसीह के शरीर को बनाती है।",
      watchSermons: "उपदेश देखें",
      learnMore: "और जानें",
    },
    sections: {
      latestSermons: "नवीनतम उपदेश",
      recentMessages: "हालिया संदेश",
      viewAll: "सभी देखें",
      viewAllSermons: "सभी उपदेश देखें",
      upcomingEvents: "आगामी कार्यक्रम",
      whatsComingUp: "आगे क्या है",
      allEvents: "सभी कार्यक्रम",
      ourMinistries: "हमारी सेवाएँ",
      getInvolved: "जुड़ें",
      exploreMinistries: "सभी सेवाएँ देखें",
      aboutUs: "हमारे बारे में",
      ourStory: "हमारी कहानी",
      partnerWithUs: "सेवकाई में हमारे साथ भागीदार बनें",
      giveToday: "आज दान करें",
      connectWithUs: "हमसे जुड़ें",
    },
    newsletter: {
      title: "जुड़े रहें",
      subtitle:
        "भक्ति लेख, सेवकाई अपडेट और कार्यक्रम रिमाइंडर सीधे आपके इनबॉक्स में पाएं।",
      namePlaceholder: "आपका नाम (वैकल्पिक)",
      emailPlaceholder: "आपका ईमेल पता",
      subscribe: "सदस्यता लें",
      successTitle: "सदस्यता हो गई!",
      successMessage: "धन्यवाद। हम जल्द ही प्रोत्साहक सामग्री के साथ संपर्क करेंगे।",
    },
    common: {
      weekly: "साप्ताहिक",
      readMore: "और पढ़ें",
      by: "लेखक",
    },
  },
};
