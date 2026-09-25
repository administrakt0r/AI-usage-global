"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { FileTextIcon, MailIcon, UserIcon } from "lucide-react";

import { CONTACT_EMAIL } from "@/lib/site";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resolvedSubject =
      subject.trim() || `Inquiry from ${name || "new contact"}`;

    const bodyLines = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      "",
      "Message:",
      message || "-",
    ];

    setIsSubmitted(true);

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(resolvedSubject)}&body=${encodeURIComponent(
      bodyLines.join("\n"),
    )}`;
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {isSubmitted && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400"
        >
          Opening your email client... If it doesn&apos;t open automatically,
          please email us directly at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">
          Name <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            required
            aria-required="true"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="peer h-10 pr-9"
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
            <UserIcon className="size-4" />
            <span className="sr-only">Name</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            required
            aria-required="true"
            placeholder="Your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="peer h-10 pr-9"
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
            <MailIcon className="size-4" />
            <span className="sr-only">Email</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <div className="relative">
          <Input
            id="subject"
            type="text"
            placeholder="What is this about?"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="peer h-10 pr-9"
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
            <FileTextIcon className="size-4" />
            <span className="sr-only">Subject</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="message"
          required
          aria-required="true"
          className="h-28 resize-none"
          placeholder="Write your message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <Button type="submit" size="lg" className="w-full text-base">
        Send message
      </Button>
    </form>
  );
};

export default ContactForm;