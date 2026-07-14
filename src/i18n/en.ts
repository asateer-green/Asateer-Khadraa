// src/i18n/en/index.ts
// ⚠️ لا تضع type annotation هنا (TranslationNamespace) —
//    الـ explicit cast يمنع TypeScript من تتبع الـ nested structure.

const en = {
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    search: "Search",
    filter: "Filter",
    close: "Close",
    submit: "Submit",
    noResults: "No results found",
  },
  nav: {
    home: "Home",
    about: "About Us",
    services: "Services",
    portfolio: "Portfolio",
    contact: "Contact",
    quoteRequest: "Get a quote",
    dashboard: "Dashboard",
    login: "Login",
    logout: "Logout",
  },
  hero: {
    titleNormal: "Asateer Green",
    titleGradient: "Print & Advertising",
    description:
      "An integrated creative studio delivering visual identity, premium print, manufacturing and outdoor advertising across Saudi Arabia.",
    viewPortfolio: "View Our Portfolio",
  },
  about: {
    badge: "Why Choose Us?",
    title: "Transforming Brands into an Integrated Visual Presence",
    description:
      "Asateer Green is a creative agency specializing in advertising, media, and print production. We deliver comprehensive identity solutions and advertising services, merging creative concepts with corporate-grade manufacturing to craft premium end-to-end user experiences—from initial logo design to high-impact outdoor billboards.",
    description2: "Print & advertising, engineered for ambitious brands.",
    cta: "Our Services",
  },
  services: {
  title: "Our Integrated Services",
  subtitle: "Integrated production services across visual identity, printing, fabrication, and premium corporate gifts.",
  bottomCta: "Explore All Services",
  items: {
    media: {
      title: "Design & Media",
      desc: "Integrated visual identity design, professional photography, video and motion graphics production, and premium creative content.",
      bullets: ["Visual Identity", "Photography", "Motion Graphics", "Video Production"],
    },
    printing: {
      title: "Digital Printing",
      desc: "Indoor and outdoor printing using HP, Plamac, and OKI equipment with superior color accuracy on all materials.",
      bullets: ["Offset Printing", "Signage", "Digital Printing", "Packaging & Boxes"],
    },
    gifts: {
      title: "Promotional Gifts",
      desc: "Innovative and customized promotional gifts for companies and institutions to enhance brand presence.",
      bullets: ["Corporate VIP Gifts", "Custom Pens & Notebooks", "Event Merch", "Trophies & Awards"],
    },
    manufacturing: {
      title: "Manufacturing & Production",
      desc: "Custom fabrication of all signage types, cladding structures, display stands, and exhibition booths.",
      bullets: ["Cladding Signage", "3D Luminous Letters", "Display Stands", "Exhibition Booths"],
    },
    advertising: {
      title: "Integrated Advertising Solutions",
      desc: "Comprehensive advertising solutions including strategic planning, campaign management, digital marketing, and outdoor advertising.",
      bullets: ["Strategic Planning", "Campaign Management", "Digital Marketing", "Outdoor Advertising"],
    },
    branding: {
      title: "Branding & Visual Identity",
      desc: "Brand development through logo design, color selection, visual identity guidelines, and marketing materials.",
      bullets: ["Logo Design", "Color Palette", "Brand Guidelines", "Marketing Materials"],
    },
    events: {
      title: "Events & Exhibitions",
      desc: "Full event and exhibition setup from graphic design to booth fabrication and signage production.",
      bullets: ["Event Graphics", "Booth Fabrication", "Event Signage", "Exhibition Setup"],
    },
    other: {
      title: "Other Services",
      desc: "Additional services including marketing consultancy, packaging design, social media management, and specialized printing.",
      bullets: ["Marketing Consultancy", "Packaging Design", "Social Media Management", "Specialized Printing"],
    },
  },
},
  features: {
    badge: "Why Choose Us",
    mainTitle: "What Makes Us Different",
    subtitle:
      "A blend of creativity, precision, and customer-centricity that sets us apart in the industry.",
    items: {
      equipment: {
        title: "Industrial equipment",
        desc: "“HP, Plamac and OKI printers are calibrated to deliver identity-conforming colors no matter the size.",
      },
      durability: {
        title: "Designed to withstand outdoor conditions.",
        desc: "Weather-resistant materials, multi-layer coatings, and long-lifespan LED lighting systems.",
      },
      responsibility: {
        title: "Integrated responsibility",
        desc: "From concept to production, installation, and after-sales service. One team, one standard.",
      },
    },
    cta: {
      title: "Ready to elevate your brand?",
      desc: "Contact us today to discuss your project and discover how we can bring your vision to life.",
      button: "Get in Touch",
    },
  },
  portfolio: {
    title: "Our Work",
    subtitle: "Samples of our creative projects",
    viewAll: "View All Work",
  },
  contact: {
    title: "Contact Us",
    description:
      "Tell us about your brand — we'll come back within one business day.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    send: "Send Message",
    successMessage:
      "Your message was sent successfully. We'll get back to you soon.",
    address: "Kingdom of Saudi Arabia",
    emailAddress: "Asateer.gr@gmail.com",
    phoneNumber: "+966570105601",
  },
  quote: {
    title: "Request a Quote",
    serviceType: "Service Type",
    description: "Project Description",
    budget: "Estimated Budget",
    deadline: "Required Deadline",
    submit: "Submit Request",
    success_title: "Your request has been received!",
    successMessage:
      "Your request has been received. We'll contact you within 24 hours.",
  },
  dashboard: {
    title: "Dashboard",
    overview: "Overview",
    services: "Manage Services",
    signage: "Manage Signage",
    logos: "Manage Logos",
    portfolio: "Manage Portfolio",
    categories: "Manage Categories",
    quotes: "Manage Quotes",
    settings: "Settings",
    totalQuotes: "Total Quotes",
    pendingQuotes: "Pending Quotes",
    totalServices: "Total Services",
    totalPortfolio: "Total Portfolio",
  },
  auth: {
    login: "Login",
    email: "Email",
    password: "Password",
    loginButton: "Sign In",
    invalidCredentials: "Invalid credentials",
    forgotPassword: "Forgot password?",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
    toggle: "Toggle Theme",
  },
  language: {
    arabic: "العربية",
    english: "English",
    switch: "تغيير اللغة",
  },
  errors: {
    notFound: "Page Not Found",
    notFoundDescription: "Sorry, the page you're looking for doesn't exist.",
    serverError: "Server Error",
    unauthorized: "Unauthorized",
    goHome: "Go Home",
  },
} as const;

export default en;
