import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import dataService from "@/lib/dataService";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome, GraduationCap } from "lucide-react";

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm outline-none",
      "placeholder:text-muted-foreground",
      "focus:ring-2 focus:ring-ring/40 focus:border-ring",
      className
    )}
    {...props}
  />
);

const Checkbox = ({ className, ...props }) => (
  <input
    type="checkbox"
    className={cn(
      "h-4 w-4 rounded border border-border/60 text-foreground",
      "focus:ring-2 focus:ring-ring/40 focus:border-ring",
      className
    )}
    {...props}
  />
);

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [role, setRole] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const validate = () => {
    if (!name || name.length < 2) return "Please enter your full name.";
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!pwd || pwd.length < 6) return "Password must be at least 6 characters.";
    if (pwd !== confirmPwd) return "Passwords do not match.";
    if (!role) return "Please select your role.";
    if (!agree) return "Please agree to the terms and conditions.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr("");
    setLoading(true);
    try {
      // Create user with the database
      const userData = {
        name,
        email,
        password: pwd,
        role: 'student',
        level: 1,
        xp: 0,
        streak: 0,
        enrolledCourses: [],
        lastLogin: new Date().toISOString()
      };
      const newUser = await dataService.createUser(userData);

      if (newUser) {
        // Store user session (in a real app, use proper session management)
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        console.log("User created:", newUser);

        // Navigate based on selected role
        navigate("/student/dashboard");
      } else {
        setErr("Failed to create account. Please try again.");
      }
    } catch (e) {
      console.error("Signup error:", e);
      setErr("Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onOAuth = (provider) => {
    // TODO: wire your provider login
    console.log(`OAuth with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Header with Back */}
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Sign up</h1>
            <p className="text-muted-foreground text-sm">Create your account to get started.</p>
          </div>
        </div>

        <Card className="rounded-xl border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    autoComplete="new-password"
                    className="pl-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((s) => !s)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    autoComplete="new-password"
                    className="pl-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                  >
                    {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">I am a</label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setRole("student")}
                    className="flex flex-col items-center gap-1 h-auto py-2"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-xs">Student</span>
                  </Button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2">
                <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <label className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Error */}
              {err && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
                  {err}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full px-4"
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onOAuth("google")}
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => onOAuth("github")}
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <a href="/signin" className="underline underline-offset-2 hover:text-foreground">
                Sign in
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
