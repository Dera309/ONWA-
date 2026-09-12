"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface NewsletterSubscribeProps {
  buttonText?: string;
  placeholder?: string;
  className?: string;
  source?: string;
}

export function NewsletterSubscribe({
  buttonText = "Subscribe",
  placeholder = "Enter your email",
  className = "",
  source = "home",
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setFeedbackMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setFeedbackMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFeedbackMessage(data.message || "Thank you for joining the Collector Circle.");
        setEmail("");
      } else {
        setStatus("error");
        setFeedbackMessage(data.error || "Unable to subscribe. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setFeedbackMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {status === "success" ? (
        <div className="p-6 bg-primary/10 border border-primary/30 rounded flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
          <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
          <p className="museum-heading text-headline-sm text-primary mb-1">
            Welcome to the Circle
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {feedbackMessage}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-xs text-primary/70 hover:text-primary underline label-caps"
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder={placeholder}
              disabled={status === "loading"}
              className="flex-1 px-4 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-primary placeholder:text-muted-foreground disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>{buttonText}</span>
              )}
            </button>
          </div>

          {status === "error" && feedbackMessage && (
            <div className="flex items-center gap-2 text-xs text-red-400 mt-1 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
