import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Link2, BarChart3, Pencil, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    icon: Link2,
    title: "Instant URL Shortening",
    description:
      "Paste any long URL and get a clean, shareable short link in seconds. No friction, no fuss.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "See exactly how many times each of your links has been clicked so you can measure what works.",
  },
  {
    icon: Pencil,
    title: "Custom Short Links",
    description:
      "Create memorable, branded slugs instead of random strings to build trust with your audience.",
  },
  {
    icon: LayoutDashboard,
    title: "Centralized Dashboard",
    description:
      "Manage, edit, and organize all your short links from one clean dashboard.",
  },
];

const steps = [
  { number: "1", label: "Paste your long URL" },
  { number: "2", label: "Get a short link instantly" },
  { number: "3", label: "Share it and track clicks" },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
          <Link2 className="size-3.5" />
          Simple, fast link shortening
        </div>
        <h1 className="max-w-2xl text-5xl font-bold tracking-tight">
          Shorten. Share.{" "}
          <span className="text-primary">Track.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Turn long, unwieldy URLs into clean short links — then see exactly who
          clicks them. Built for anyone who shares links online.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <SignUpButton mode="modal">
            <Button size="lg" className="h-11 px-6 text-base">
              Get Started for Free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="h-11 px-6 text-base">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">
            Everything you need to manage links
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-10 text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            {steps.map(({ number, label }, index) => (
              <div key={number} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {number}
                  </div>
                  <p className="text-sm font-medium">{label}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden h-px w-16 bg-border sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-auto border-t border-border px-6 py-16 text-center">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">
          Ready to get started?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Join thousands of people who trust us to manage their links.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" className="h-11 px-8 text-base">
            Create your free account
          </Button>
        </SignUpButton>
      </section>
    </div>
  );
}
