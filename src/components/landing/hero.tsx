import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { BackgroundBeams } from "../ui/background-beams";
import { ArrowRight, FileText, Sparkles, Zap } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundBeams />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-8 sm:py-0">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          <span className="text-xs sm:text-sm font-medium">
            AI-Powered Document Tools
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
          Transform Your
          <span className="bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {" "}
            Documents{" "}
          </span>
          with AI
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
          Edit, convert, summarize, paraphrase, and analyze your documents with
          powerful AI tools. All in one place, completely free.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <Button
            asChild
            size="lg"
            className="text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 w-full sm:w-auto"
          >
            <Link to="/auth/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-base sm:text-lg px-6 py-5 sm:px-8 sm:py-6 w-full sm:w-auto"
          >
            <a href="#features">Explore Features</a>
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur border">
            <div className="p-2 rounded-md bg-primary/10 shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm sm:text-base">
                Rich Text Editor
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Markdown, HTML & more
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur border">
            <div className="p-2 rounded-md bg-purple-500/10 shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm sm:text-base">
                AI Summarizer
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Instant summaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur border">
            <div className="p-2 rounded-md bg-pink-500/10 shrink-0">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm sm:text-base">15+ Tools</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                All-in-one platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
