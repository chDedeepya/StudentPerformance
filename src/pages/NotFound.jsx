import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Home,
  ArrowLeft,
  Search,
  RefreshCw,
  AlertTriangle,
  Sparkles
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">

        {/* Animated 404 Display */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-fade-in">
              404
            </h1>
            <div className="flex justify-center mt-4">
              <Badge variant="secondary" className="animate-bounce">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Page Not Found
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-card border-0 bg-gradient-card backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Oops! Something went wrong
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The page you're looking for seems to have wandered off into the digital void.
                Don't worry, it happens to the best of us!
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-4 my-8">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-primary-glow rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGoHome}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                size="lg"
                className="hover:bg-secondary/50 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Alternative Options */}
            <div className="pt-6 border-t border-border/50">
              <p className="text-muted-foreground mb-4">Or try these options:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10 transition-colors"
                  onClick={() => navigate("/student/dashboard")}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Student Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-success/10 transition-colors"
                  onClick={() => navigate("/faculty/dashboard")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Faculty Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-warning/10 transition-colors"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun Footer Message */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Lost? Let us help you find your way back to learning! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
