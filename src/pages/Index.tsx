import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarDays, Search, UserCheck, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl animate-fade-in">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Discover events<br />
                that inspire you
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed">
                Browse, register, and manage events all in one place. Find your next experience from thousands of curated events.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/events">
                  <Button size="lg" className="gap-2 rounded-xl bg-primary-foreground text-accent hover:bg-primary-foreground/90 font-medium">
                    Browse Events <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="rounded-xl border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Smart Discovery",
              desc: "Search and filter events by category, date, and location with real-time results.",
            },
            {
              icon: CalendarDays,
              title: "Easy Registration",
              desc: "Register for events in one click and manage all your bookings from your dashboard.",
            },
            {
              icon: UserCheck,
              title: "Personal Dashboard",
              desc: "Track upcoming events, view past history, and manage your registrations effortlessly.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-elevated"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-accent shadow-glow">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
