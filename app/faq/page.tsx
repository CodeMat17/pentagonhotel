import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { JsonLd, faqSchema } from "@/components/structured-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getFaqs, getSettings } from "@/lib/content";
import { ogImage, resolveContact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Check-in times, cancellation policy, parking, Wi-Fi, airport distance, children, accessibility and payment — answered for Pentagon International Hotel & Suites, Choba.",
  alternates: { canonical: "/faq" },
  openGraph: {
    images: [ogImage],
    title: `FAQ · ${site.name}`,
    description: "Everything guests ask, answered before you have to call.",
    url: `${site.url}/faq`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  const contact = resolveContact(settings);
  const faqCategories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <PageHeader
        title="Frequently Asked Questions"
        description="The things guests ask most, answered plainly. If yours isn't here, reception answers the phone 24 hours a day."
        crumbs={[{ name: "FAQ", href: "/faq" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <nav aria-label="FAQ categories" className="lg:sticky lg:top-28 lg:h-fit">
            <h2 className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
              Jump to
            </h2>
            <ul className="mt-4 space-y-1">
              {faqCategories.map((category) => (
                <li key={category}>
                  <a
                    href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            {faqCategories.map((category) => (
              <section
                key={category}
                id={category.toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-28"
              >
                <h2 className="font-heading text-2xl font-extrabold">{category}</h2>
                <Accordion className="mt-4">
                  {faqs
                    .filter((faq) => faq.category === category)
                    .map((faq) => (
                      <AccordionItem key={faq.question} value={faq.question}>
                        <AccordionTrigger className="py-4 text-base">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="pr-6 leading-relaxed text-muted-foreground">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </section>
            ))}
          </div>
        </div>
      </Section>

      <Section muted aria-label="Still have a question">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Still stuck?"
            title="Ask a person instead"
            description="Reception is staffed 24 hours a day, and whoever answers can actually make decisions."
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
              render={<a href={contact.telHref} />}
            >
              <PhoneIcon /> {contact.phoneDisplay}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 font-bold"
              render={
                <a
                  href={contact.whatsapp.general}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircleIcon /> WhatsApp us
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-12 font-bold"
              render={<Link href="/contact" />}
            >
              Send a message
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
