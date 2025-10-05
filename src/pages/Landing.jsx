import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Users,
  Settings,
  Trophy,
  BarChart3,
  BookOpen,
  Target,
  Zap,
  Twitter,
  Linkedin,
  Github,
  Mail
} from "lucide-react";

/**
 * Header with translucent glass, sticky, and Sign in / Sign up actions
 */
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
        <Link to="/" className="group flex items-center gap-2 font-extrabold tracking-tight">
          <GraduationCap className="h-6 w-6 text-accent transition-transform group-hover:rotate-6" />
          <span className="text-lg md:text-xl">SmartLearn</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#roles" className="transition-colors hover:text-foreground">Roles</a>
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#cta" className="transition-colors hover:text-foreground">Get started</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/signin">
            <Button variant="ghost" className="rounded-full px-5">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button className="rounded-full px-5 shadow-lg">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

const Landing = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Access courses, complete levels, track your progress and compete with peers",
      icon: GraduationCap,
      features: ["Gamified Learning", "Progress Tracking", "Interactive Assessments", "Achievement System"],
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: "faculty",
      title: "Faculty",
      description: "Monitor student performance, create assignments, and manage course content",
      icon: Users,
      features: ["Student Analytics", "Course Management", "Assessment Creation", "Performance Reports"],
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "admin",
      title: "Admin",
      description: "Full platform control, user management, and system oversight",
      icon: Settings,
      features: ["User Management", "System Analytics", "Course Administration", "Platform Control"],
      color: "from-amber-500 to-rose-500",
    },
  ];

  const features = [
    { icon: Trophy, title: "Gamified Learning", description: "Level-based progression with badges, points, and leaderboards" },
    { icon: BarChart3, title: "Performance Analytics", description: "Comprehensive tracking with daily, weekly, and monthly reports" },
    { icon: BookOpen, title: "B.Tech Courses", description: "Complete curriculum for all engineering subjects and specializations" },
    { icon: Target, title: "Predictive Analysis", description: "AI-powered insights to predict and improve student outcomes" },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    if (roleId === 'student') navigate("/signup");
    else navigate("/signin");
  };

  const handleRoleKeyDown = (e, roleId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRoleSelect(roleId);
    }
  };

  return (
    <div className="relative min-h-screen text-foreground">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-indigo-600/15 via-fuchsia-500/10 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_0%_0%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(60%_60%_at_100%_100%,rgba(236,72,153,0.18),transparent_60%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 mix-blend-overlay [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <div className="mx-auto h-[420px] max-w-7xl bg-gradient-to-r from-indigo-500/10 via-transparent to-fuchsia-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section
        className={cn(
          "relative mx-auto max-w-7xl overflow-hidden rounded-none px-6 py-20 md:rounded-3xl md:px-12 md:py-24",
          "border bg-background/70 backdrop-blur-md shadow-[0_10px_60px_-15px_rgba(0,0,0,0.2)]"
        )}
      >
        <div className="text-center">
          <Badge
            variant="secondary"
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold tracking-wide md:text-lg"
            aria-label="Advanced Learning Platform"
          >
            <Zap className="h-5 w-5" />
            Advanced Learning Platform
          </Badge>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-4xl font-extrabold tracking-tight md:mb-8 md:text-7xl"
          >
            Smart Learning for
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
              B.Tech Students
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-muted-foreground md:mb-12 md:text-2xl"
          >
            Experience gamified learning with comprehensive performance tracking, interactive assessments, and AI-powered insights for academic success.
          </motion.p>

          <div className="sr-only" aria-live="polite">
            {selectedRole ? `Selected role: ${selectedRole}` : "No role selected"}
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-8 top-8 hidden h-28 w-28 rounded-full bg-indigo-500/15 blur-2xl md:block" />
        <div className="pointer-events-none absolute -right-8 bottom-8 hidden h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl md:block" />
      </section>

      {/* Role Selection */}
      <section id="roles" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-3xl font-extrabold md:mb-6 md:text-5xl">Choose Your Role</h2>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-2xl">
            Get started with role-based access to unlock personalized features and dashboards
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            const selected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                aria-label={`Get started as ${role.title}`}
                className="group text-left focus:outline-none"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => handleRoleSelect(role.id)}
                  onKeyDown={(e) => handleRoleKeyDown(e, role.id)}
                  tabIndex="0"
                  className={cn(
                    "relative h-full rounded-2xl border border-border/60 bg-card/60 shadow-lg transition-transform cursor-pointer",
                    "group-hover:shadow-2xl group-focus-visible:shadow-2xl",
                    "focus-visible:-translate-y-2 focus-visible:ring-2 focus-visible:ring-ring/50",
                    selected && "ring-4 ring-primary"
                  )}
                >
                  <CardHeader>
                    <div
                      className={cn(
                        "mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r text-white",
                        role.color
                      )}
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold md:text-3xl">{role.title}</CardTitle>
                    <CardDescription className="text-base md:text-lg">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {role.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm font-medium md:text-lg">
                          <span className="mr-3 h-2 w-2 rounded-full bg-primary md:mr-4" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 md:mt-8">
                      <span className="inline-flex w-full items-center justify-center">
                        <Button className="w-full rounded-xl text-base md:text-lg">
                          Get Started as {role.title}
                        </Button>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl rounded-3xl bg-muted/40 px-6 py-16 shadow-sm md:px-12 md:py-24">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-3xl font-extrabold md:mb-6 md:text-5xl">Platform Features</h2>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-2xl">
            Comprehensive tools and analytics to enhance the learning experience
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 md:gap-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="relative overflow-hidden rounded-2xl border bg-card/70 p-6 text-center shadow-sm backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg md:mb-6 md:h-20 md:w-20">
                  <Icon className="h-8 w-8 md:h-10 md:w-10" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold md:mb-3 md:text-2xl">{feature.title}</h3>
                <p className="text-sm text-muted-foreground md:text-lg">{feature.description}</p>

                {/* Subtle gradient accent */}
                <div aria-hidden className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-[120%] -translate-x-1/2 rounded-t-full bg-gradient-to-t from-primary/10 to-transparent" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section id="cta" className="mt-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-indigo-600/10 via-background to-fuchsia-600/10 px-6 py-16 shadow-inner md:px-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="mb-4 text-2xl font-extrabold md:mb-6 md:text-3xl">Ready to Transform Learning?</h3>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground md:mb-10 md:text-xl">
              Join thousands of students and educators already using our platform to achieve better learning outcomes.
            </p>
            <Link to="/signup" className="inline-flex">
              <Button className="rounded-full px-8 py-3 text-base shadow-xl md:px-12 md:py-4 md:text-lg">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="mt-16 border-t bg-foreground/95 text-background">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link to="/" className="mb-4 inline-flex items-center gap-2 font-extrabold">
                <GraduationCap className="h-6 w-6" /> SamrtLearn
              </Link>
              <p className="mt-3 text-sm text-background/80">
                A modern, AI-powered learning platform for B.Tech students and educators. Gamified, data-driven, and secure.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a href="https://in.linkedin.com/" aria-label="Twitter" className="rounded-full p-2 transition-opacity hover:opacity-80">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://in.linkedin.com/" aria-label="LinkedIn" className="rounded-full p-2 transition-opacity hover:opacity-80">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://github.com/chDedeepya" aria-label="GitHub" className="rounded-full p-2 transition-opacity hover:opacity-80">
                  <Github className="h-5 w-5" />
                </a>
                <a href="mailto:support@smartlearn.app" aria-label="Email" className="rounded-full p-2 transition-opacity hover:opacity-80">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-lg font-semibold">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-background/80">
                <li><a href="#features" className="hover:underline">Features</a></li>
                <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
                <li><Link to="/roadmap" className="hover:underline">Roadmap</Link></li>
                <li><Link to="/changelog" className="hover:underline">Changelog</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold">Resources</h4>
              <ul className="mt-4 space-y-2 text-sm text-background/80">
                <li><Link to="/docs" className="hover:underline">Documentation</Link></li>
                <li><Link to="/blog" className="hover:underline">Blog</Link></li>
                <li><Link to="/support" className="hover:underline">Support</Link></li>
                <li><Link to="/community" className="hover:underline">Community</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold">Stay in the loop</h4>
              <p className="mt-3 text-sm text-background/80">Get product updates, new features, and tips—straight to your inbox.</p>
              <form
                className="mt-4 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks for subscribing! (wire up your handler)");
                }}
              >
                <Input type="email" required placeholder="you@college.edu" className="bg-background text-foreground" />
                <Button type="submit" variant="secondary">Subscribe</Button>
              </form>
              <p className="mt-2 text-xs text-background/60">By subscribing, you agree to our <Link to="/privacy" className="underline">Privacy Policy</Link>.</p>
            </div>
          </div>

          <div className="mt-10 border-t border-background/20 pt-6 text-xs text-background/70 md:flex md.items-center md:justify-between">
            <p>© {new Date().getFullYear()} SmartLearn. All rights reserved.</p>
            <ul className="mt-4 flex items-center gap-4 md:mt-0">
              <li><Link to="/terms" className="hover:underline">Terms</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
              <li><Link to="/security" className="hover:underline">Security</Link></li>
              <li><Link to="/status" className="hover:underline">Status</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
