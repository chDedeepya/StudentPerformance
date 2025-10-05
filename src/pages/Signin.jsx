import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import dataService from "@/lib/dataService";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";

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

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const validate = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!pwd || pwd.length < 6) return "Password must be at least 6 characters.";
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
      // Authenticate user with the database
      const user = await dataService.authenticateUser(email, pwd);

      if (user) {
        // Store user session (in a real app, use proper session management)
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log("User authenticated:", user);

        // Navigate based on user role
        switch (user.role) {
          case 'admin':
            navigate("/admin/dashboard");
            break;
          case 'faculty':
            navigate("/faculty/dashboard");
            break;
          case 'student':
          default:
            navigate("/student/dashboard");
            break;
        }
      } else {
        setErr("Invalid email or password. Please try again.");
      }
    } catch (e) {
      console.error("Authentication error:", e);
      setErr("Sign-in failed. Please try again.");
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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Sign in</h1>
            <p className="text-muted-foreground text-sm">Welcome back! Please enter your details.</p>
          </div>
        </div>

        <Card className="rounded-xl border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
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
                    autoComplete="current-password"
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

              {/* Row: remember + forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                  Forgot password?
                </a>
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
                {loading ? "Signing in..." : "Sign in"}
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
              Don’t have an account?{" "}
              <a href="/signup" className="underline underline-offset-2 hover:text-foreground">
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
