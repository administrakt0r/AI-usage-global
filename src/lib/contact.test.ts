import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { POST } from "@/app/api/contact/route";
import { validateAndSanitizeContactPayload } from "@/lib/contact";

describe("contact validation and sanitization", () => {
  it("validates a valid payload successfully", () => {
    const result = validateAndSanitizeContactPayload({
      name: "Jane Doe",
      email: "Jane@Example.com",
      subject: "Inquiry about AI water usage",
      message: "Hello, I would like to learn more.",
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.data, {
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Inquiry about AI water usage",
      message: "Hello, I would like to learn more.",
    });
  });

  it("sanitizes CRLF line breaks in name and subject headers", () => {
    const result = validateAndSanitizeContactPayload({
      name: "Jane\r\nHeaderInject",
      email: "jane@example.com",
      subject: "Test Subject\nBcc: evil@attacker.com",
      message: "Valid message content.",
    });

    assert.equal(result.valid, true);
    assert.equal(result.data?.name, "Jane HeaderInject");
    assert.equal(result.data?.subject, "Test Subject Bcc: evil@attacker.com");
  });

  it("fails validation for invalid email formats", () => {
    const result = validateAndSanitizeContactPayload({
      email: "not-an-email",
      message: "Valid message",
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.email);
  });

  it("fails validation for missing required fields", () => {
    const result = validateAndSanitizeContactPayload({
      email: "",
      message: "",
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.email);
    assert.ok(result.errors.message);
  });

  it("fails validation when message exceeds length limit", () => {
    const longMessage = "a".repeat(5001);

    const result = validateAndSanitizeContactPayload({
      email: "jane@example.com",
      message: longMessage,
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.message);
  });

  it("generates default subject when subject is omitted", () => {
    const result = validateAndSanitizeContactPayload({
      name: "Alice",
      email: "alice@example.com",
      message: "Test message",
    });

    assert.equal(result.valid, true);
    assert.equal(result.data?.subject, "Inquiry from Alice");
  });
});

describe("POST /api/contact route handler", () => {
  it("returns 200 OK for valid contact payload", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "user@example.com",
        subject: "Test Subject",
        message: "Hello world!",
      }),
    });

    const response = await POST(request);

    assert.equal(response.status, 200);

    const json = await response.json();

    assert.equal(json.success, true);
  });

  it("returns 400 Bad Request for invalid email in payload", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "invalid-email-address",
        message: "Hello world!",
      }),
    });

    const response = await POST(request);

    assert.equal(response.status, 400);

    const json = await response.json();

    assert.equal(json.success, false);
    assert.ok(json.errors.email);
  });

  it("returns 400 Bad Request for malformed JSON request body", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid-json{",
    });

    const response = await POST(request);

    assert.equal(response.status, 400);

    const json = await response.json();

    assert.equal(json.success, false);
    assert.equal(json.error, "Invalid JSON payload.");
  });
});
