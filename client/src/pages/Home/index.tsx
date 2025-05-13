import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Globe,
  Users,
  Lightbulb,
  MessageSquare,
  Menu,
  X,
  Github,
  Twitter,
  ChevronRight,
  Info,
  HelpCircle,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { CustomLink } from "../../components/ui/custom-link"
import HeroGraphic from "../../components/hero-graphic"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const ctaRef = useRef(null)
  const faqRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 100

      const featuresElement = document.getElementById("features")
      const faqElement = document.getElementById("faq")
      const ctaElement = document.getElementById("cta")

      if (featuresElement && featuresElement.offsetTop <= scrollPosition) {
        setActiveSection("features")
      } else {
        setActiveSection("home")
      }

      if (faqElement && faqElement.offsetTop <= scrollPosition) {
        setActiveSection("faq")
      }

      if (ctaElement && ctaElement.offsetTop <= scrollPosition) {
        setActiveSection("cta")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Features", href: "#features", icon: <Info className="h-4 w-4 mr-1" /> },
    { name: "FAQ", href: "#faq", icon: <HelpCircle className="h-4 w-4 mr-1" /> },
  ]

  const features = [
    {
      title: "Discover Hackathons",
      description: "Browse and register for upcoming hackathons that match your interests and skills.",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      title: "Form Teams",
      description: "Create or join teams with other participants to collaborate on projects.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Share Ideas",
      description: "Propose project ideas and get feedback from your team members.",
      icon: <Lightbulb className="h-6 w-6" />,
    },
    {
      title: "Collaborate",
      description: "Communicate with your team and work together to build innovative solutions.",
      icon: <MessageSquare className="h-6 w-6" />,
    },
  ]

  const faqs = [
    {
      question: "What is HackMap?",
      answer:
        "HackMap is a platform designed to help developers, designers, and creators connect, form teams, and collaborate on projects during hackathons. It provides tools for team formation, project management, and communication.",
    },
    {
      question: "How do I join a hackathon?",
      answer:
        "After creating an account, you can browse upcoming hackathons on the platform and register for those that interest you. Once registered, you can start forming or joining teams for the event.",
    },
    {
      question: "Can I participate in hackathons remotely?",
      answer:
        "Yes! Many hackathons on HackMap support remote participation. You can collaborate with team members from anywhere in the world using our built-in communication and project management tools.",
    },
    {
      question: "How do I form a team?",
      answer:
        "You can either create a new team and invite others to join, or browse existing teams looking for members with your skills. Our team matching algorithm also suggests potential teammates based on skills and interests.",
    },
    {
      question: "Is HackMap free to use?",
      answer:
        "Yes, HackMap offers a free tier that includes all the essential features for participating in hackathons. We also offer premium plans for organizations hosting hackathons with additional features and support.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div
              className="flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex-shrink-0 flex items-center">
                <motion.h1
                  className={`text-2xl font-bold ${
                    scrolled ? "bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent" : "text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  HackMap
                </motion.h1>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <CustomLink
                    href={link.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      scrolled
                        ? activeSection === link.name.toLowerCase()
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                        : "text-white hover:text-blue-100"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </CustomLink>
                  {activeSection === link.name.toLowerCase() && (
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${scrolled ? "bg-blue-600" : "bg-white"}`}
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CustomLink
                  href="/login"
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    scrolled ? "text-gray-600 hover:text-blue-600" : "text-white hover:text-blue-100"
                  }`}
                >
                  Sign In
                </CustomLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <CustomLink href="/register">
                  <Button
                    className={`px-4 py-2 rounded-md transition-all duration-200 shadow-lg hover:shadow-blue-200/50 ${
                      scrolled ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white hover:bg-blue-50 text-blue-600"
                    }`}
                  >
                    Sign Up
                  </Button>
                </CustomLink>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200 ${
                  scrolled ? "text-gray-400 hover:text-blue-600" : "text-white hover:text-blue-100"
                }`}
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white shadow-lg rounded-b-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-2 pb-3 space-y-1 px-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                  >
                    <CustomLink
                      href={link.href}
                      className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                        activeSection === link.name.toLowerCase()
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </CustomLink>
                  </motion.div>
                ))}

                <div className="pt-4 pb-2 border-t border-gray-200">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <CustomLink
                      href="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </CustomLink>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <CustomLink
                      href="/register"
                      className="block mt-2 px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </CustomLink>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section with Gradient Background */}
      <section
        id="home"
        className="relative pt-20 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600"
        ref={heroRef}
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-60 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, y: 50 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <motion.h1
                  className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <span className="block">Connect, Collaborate,</span>
                  <span className="block text-blue-100">Build Amazing Projects</span>
                </motion.h1>

                <motion.p
                  className="mt-3 text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl max-w-xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Join hackathons, form teams, and collaborate on innovative projects with fellow developers, designers,
                  and creators.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <CustomLink href="/register">
                      <Button className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-600 px-8 py-3 rounded-md text-base font-medium shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
                        Get Started
                      </Button>
                    </CustomLink>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <CustomLink href="/login">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-blue-200 bg-transparent text-white hover:bg-white/10 px-8 py-3 rounded-md text-base font-medium transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </CustomLink>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="relative"
              >
                <HeroGraphic />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white relative overflow-hidden" ref={featuresRef}>
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 -translate-y-1/2 translate-x-1/3"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 translate-y-1/2 -translate-x-1/3"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="lg:text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-base text-blue-600 font-semibold tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Features
            </motion.h2>

            <motion.p
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Everything you need for hackathons
            </motion.p>

            <motion.p
              className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              HackMap provides all the tools you need to participate in hackathons and build great projects.
            </motion.p>
          </motion.div>

          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-b-xl scale-x-0 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50 relative overflow-hidden" ref={faqRef}>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-xl" />
          <div className="absolute bottom-20 left-40 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-base text-blue-600 font-semibold tracking-wide uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              FAQ
            </motion.h2>

            <motion.p
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Frequently Asked Questions
            </motion.p>

            <motion.p
              className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Everything you need to know about HackMap and how it works.
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className={index === 0 ? "border-t" : ""}>
                    <AccordionTrigger className="px-6 text-left font-semibold text-gray-900 hover:text-blue-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 0.1 } : {}}
            transition={{ duration: 1 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </motion.div>
        </div>

        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            className="text-3xl font-extrabold text-white sm:text-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="block">Ready to get started?</span>
            <span className="block">Join HackMap today.</span>
          </motion.h2>

          <motion.p
            className="mt-4 text-lg leading-6 text-blue-100"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Sign up for free and start participating in hackathons, forming teams, and building amazing projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <CustomLink href="/register">
              <Button className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300 shadow-lg">
                Sign up for free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CustomLink>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-1">
              <motion.h1
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                HackMap
              </motion.h1>
              <p className="text-gray-400 mb-4">
                Connect, collaborate, and build amazing projects with fellow developers.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-6 w-6" />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <CustomLink href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Features
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                    FAQ
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Teams
                  </CustomLink>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Documentation
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Guides
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    API Reference
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Community
                  </CustomLink>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    About
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Blog
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Careers
                  </CustomLink>
                </li>
                <li>
                  <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Contact
                  </CustomLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} HackMap. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </CustomLink>
              <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </CustomLink>
              <CustomLink href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </CustomLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
