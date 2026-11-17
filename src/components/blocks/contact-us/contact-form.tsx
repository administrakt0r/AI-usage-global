"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { CheckCircle2Icon, FileTextIcon, MailIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    // Basic client validation
    if (!email.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter your email address.",
      });

      return;
    }

    if (!message.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please write a message.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: data.message || "Thank you! Your message has been sent.",
        });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const errorText =
          data.errors && typeof data.errors === "object"
            ? Object.values(data.errors).join(" ")
            : data.error || "Failed to send message. Please try again.";

        setStatusMessage({
          type: "error",
          text: errorText,
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {statusMessage && (
        <div
          className={`rounded-md p-4 text-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-2"
              : "bg-destructive/15 text-destructive dark:text-destructive-foreground border border-destructive/30"
          }`}
          role="alert"
        >
          {statusMessage.type === "success" && (
            <CheckCircle2Icon className="size-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Name</Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            className="peer h-10 pr-9"
            required
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
            disabled={isSubmitting}
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
          disabled={isSubmitting}
          required
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
};

export default ContactForm;