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

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(resolvedSubject)}&body=${encodeURIComponent(
      bodyLines.join("\n"),
    )}`;
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="username">Name</Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
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
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
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
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
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