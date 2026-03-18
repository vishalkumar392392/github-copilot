import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignUpButton } from '@clerk/nextjs';
import { Link2, ArrowRight, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '1',
    title: 'Paste your URL',
    description: 'Drop any long link into the shortener.',
  },
  {
    number: '2',
    title: 'Customize & shorten',
    description: 'Pick a custom slug or let us generate one instantly.',
  },
  {
    number: '3',
    title: 'Share & track',
    description: 'Send your link and watch the click data roll in.',
  },
];

const stats = [
  { value: '100 %', label: 'Free to use' },
  { value: '< 50 ms', label: 'Redirect speed' },
  { value: '99.9 %', label: 'Uptime' },
  { value: '∞', label: 'Links you can create' },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center gap-6 px-6 pt-20 pb-28 text-center overflow-hidden">
        {/* Subtle radial glow behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/5 blur-3xl"
        />

        <div className="relative inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
          <Link2 className="size-3.5" />
          Fast, free link shortening
        </div>

        <h1 className="relative max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Short links,{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            big&nbsp;impact
          </span>
        </h1>

        <p className="relative max-w-xl text-lg text-muted-foreground sm:text-xl">
          Transform long, ugly URLs into clean short links — then track every
          click with real-time analytics. Built for creators, marketers, and
          developers.
        </p>

        <div className="relative flex flex-wrap items-center justify-center gap-3 pt-2">
          <SignUpButton mode="modal">
            <Button size="lg" className="h-12 gap-2 px-6 text-base">
              Start Shortening — It&apos;s Free
              <ArrowRight className="size-4" />
            </Button>
          </SignUpButton>
        </div>

        {/* Decorative mockup hint */}
        <div className="relative mt-12 w-full max-w-2xl rounded-xl border border-border bg-card/60 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm">
            <MousePointerClick className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              https://example.com/my-very-long-url-that-nobody…
            </span>
            <ArrowRight className="size-4 text-muted-foreground" />
            <span className="font-semibold text-primary">lnk.sh/my-link</span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 px-6 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps. That&apos;s it.
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ number, title, description }) => (
              <Card key={number} className="text-center">
                <CardHeader className="items-center">
                  <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {number}
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <section className="mt-auto px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to shorten your first link?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Sign up in seconds — no credit card, no catch. Start creating short
            links and tracking clicks today.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="h-12 gap-2 px-8 text-base">
              Get Started for Free
              <ArrowRight className="size-4" />
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Link2 className="size-4" />
            Linkshortner
          </div>
          <p>
            &copy; {new Date().getFullYear()} Linkshortner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
