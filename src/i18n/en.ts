// src/i18n/en/index.ts
// ⚠️ لا تضع type annotation هنا (TranslationNamespace) —
//    الـ explicit cast يمنع TypeScript من تتبع الـ nested structure.

const en = {
 common: {
    loading: "Loading...",
    error: "An error occurred",
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
    contact: "Contact Us",
    quoteRequest: "Request Quote",
    dashboard: "Dashboard",
    login: "Login",
    logout: "Logout",
  },
  home: {
    heroTitle: "Asateer Khadraa",
    heroSubtitle: "Advertising & Marketing",
    heroDescription:
      "Integrated solutions in visual identity and advertising services. Combining creativity and professionalism to deliver a unique experience.",
    ctaPrimary: "Explore Services",
    ctaSecondary: "Contact Us",
  },
  hero: {
    titleNormal: "Asateer Khadraa",
    titleGradient: " Combining Creativity and Professionalism",
    description:
      " A creative agency specialized in visual identity, luxury printing, sign manufacturing, and outdoor signage across the Kingdom of Saudi Arabia. ",
    viewPortfolio: " View Our Work ",
  },
  about: {
    badge: " About Our Agency ",
    title: "Transforming Brands into Complete Visual Presence",
    description:
      "Asateer Khadraa is a creative agency specializing in advertising, printing, and brand production. We combine creative thinking with industrial execution to provide a seamless experience for our clients, from logo design to large-scale outdoor signage.",
    description2: "Printing & Advertising, engineering ambitious brands.",
    cta: "Our Services",
    story_title: "Combining Creativity and Professionalism",
    story_p1:
      "Asateer Khadraa is a specialized creative agency in advertising and marketing, delivering end-to-end visual identity and branding solutions. We bring together creativity and technical mastery to exceed client expectations with high-quality standards.",
  },

  services: {
    title: "What Can We Build For Your Brand?",
    subtitle:
      "Integrated production services for design, printing, manufacturing, and luxury promotional gifts",
    bottomCta: "View All Advertising Services & Solutions",
    items: {
      media: {
        title: "Visual identity design",
        desc: "Comprehensive visual identity design, professional photography, video production, motion graphics, and creative content creation that elevates your brand positioning.",
        bullets: [
          "Visual Identity",
          "Professional Photography",
          "Motion Graphics",
          "Video Production",
        ],
      },
      printing: {
        title: "Luxury printing",
        desc: "Indoor and outdoor printing using world-class HP, Plamac, and OKI equipment, guaranteeing vivid colors and high precision across all materials.",
        bullets: [
          "Offset Printing",
          "Signage Printing",
          "Digital Printing",
          "Packaging & Boxes",
        ],
      },
      gifts: {
        title: "Promotional Gifts",
        desc: "Sourcing and manufacturing innovative, customized corporate gifts designed to strengthen brand presence and leave a lasting premium impression.",
        bullets: [
          "VIP Corporate Gifts",
          "Custom Pens & Notebooks",
          "Event Printables",
          "Luxury Trophy Awards",
        ],
      },
      manufacturing: {
        title: "Exterior panels and metal structures",
        desc: "Fabrication of all types of signage, cladding structures, custom display stands, and exhibition booths crafted with high engineering quality.",
        bullets: [
          "Cladding Signage",
          "Illuminated 3D Letters",
          "Display Stands",
          "Exhibition Booth Setup",
        ],
      },
      advertising: {
        title: "Integrated Advertising Solutions",
        desc: "End-to-end marketing solutions including strategic planning, campaign management, digital marketing, and outdoor ads to reach your target audience efficiently.",
        bullets: [
          "Strategic Planning",
          "Campaign Management",
          "Digital Marketing",
          "Outdoor Advertising",
        ],
      },
      branding: {
        title: "Branding & Visual Identity",
        desc: "Brand development through logo creation, color theory, brand guidelines, and collateral design that reflect your brand core and make it stand out.",
        bullets: [
          "Logo Design",
          "Color Palette Design",
          "Brand Guidelines Manual",
          "Marketing Collaterals",
        ],
      },
      events: {
        title: "Event & Exhibition Setup",
        desc: "Full event production with modern graphic design, booth fabrication, and signage to ensure a commanding presence at every corporate event.",
        bullets: [
          "Event Graphic Design",
          "Booth Fabrication",
          "Event Signage Design",
          "Exhibition & Conference Setup",
        ],
      },
      packaging: {
        title: "Manufacturing & Assembly",
        desc: "Design and manufacturing of innovative, customized packaging and cartons for large corporations, designed to enhance your brand presence and leave a premium impression.",
        bullets: [
          "Product Packaging",
          "Custom Boxes",
          "Packaging Design",
          "Packaging Manufacturing",
        ],
      },
      other: {
        title: "Additional Services",
        desc: "Extra services tailored for your brand growth, including marketing consultancy, packaging design, social media management, and specialized printing.",
        bullets: [
          "Marketing Consultancy",
          "Packaging Design",
          "Social Media Management",
          "Specialized Printing Services",
        ],
      },
    },
  },

  features: {
    badge: "Our Standards",
    mainTitle: "Quality in Every Detail",
    subtitle:
      "From precise color calibration to weather-resistant materials, we engineer our work to endure.",
    items: {
      equipment: {
        title: "Industrial Grade Equipment",
        desc: "Calibrated HP, Plamac, and OKI printers delivering exact brand colors regardless of scale.",
      },
      durability: {
        title: "Built to Withstand Outdoors",
        desc: "Weatherproof materials, multi-coat finishes, and long-lifespan LED lighting systems.",
      },
      responsibility: {
        title: "End-to-End Ownership",
        desc: "From concept to production, installation, and after-sales service. One team, one standard.",
      },
    },
    cta: {
      title: "Let's Build Something Remarkable",
      desc: "Tell us about your brand vision, and we will respond within one business day.",
      button: "Contact Us",
    },
  },
  portfolio: {
    title: "Our Work",
    subtitle: "Showcase of Our Creative Projects",
    viewAll: "View All Projects",
  },
  contact: {
    title: "Contact Us",
    description: " Tell us about your brand, and we will get back to you within 24 hours. ",
    name: "Name",
    email: "Email Address",
    phone: "Phone Number",
    message: "Message",
    send: "Send Message",
    successMessage: "Your message was sent successfully. We will contact you soon.",
    address: "Kingdom of Saudi Arabia",
    emailAddress: "Asateer.gr@gmail.com",
    phoneNumber: "+966570105601",
  },
  quote: {
    title: "Request a Quote",
    serviceType: "Service Type",
    description: "Project Description",
    budget: "Estimated Budget",
    deadline: "Desired Deadline",
    submit: "Submit Request",
    success_title: "Request Sent Successfully!",
    successMessage: "We have received your request. We will contact you within 24 hours.",
  },
  dashboard: {
    title: "Dashboard",
    overview: "Overview",
    services: "Manage Services",
    signage: "Manage Signage",
    logos: "Manage Logos",
    portfolio: "Manage Portfolio",
    categories: "Manage Categories",
    quotes: "Manage Requests",
    settings: "Settings",
    totalQuotes: "Total Requests",
    pendingQuotes: "Pending Requests",
    totalServices: "Total Services",
    totalPortfolio: "Total Portfolio Items",
  },
  auth: {
    login: "Login",
    email: "Email Address",
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
    switch: "Switch Language",
  },
  errors: {
    notFound: "Page Not Found",
    notFoundDescription: "Sorry, the page you are looking for does not exist.",
    serverError: "Server Error",
    unauthorized: "Unauthorized Access",
    goHome: "Back to Home",
  },
};

export default en;