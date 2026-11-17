export interface ContactPayload {
  name?: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SanitizedContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  data?: SanitizedContactPayload;
}

/**
 * Strips single-line header control characters (CR, LF, Tab) and trims whitespace.
 */
function sanitizeSingleLine(input: string | undefined): string {
  if (!input) return "";

  return input.replace(/[\r\n\t]+/g, " ").trim();
}

/**
 * Standard email format check.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates and sanitizes incoming contact form payload.
 */
export function validateAndSanitizeContactPayload(
  payload: unknown,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!payload || typeof payload !== "object") {
    return {
      valid: false,
      errors: { _form: "Invalid request payload." },
    };
  }

  const raw = payload as Partial<ContactPayload>;

  const rawName = typeof raw.name === "string" ? raw.name : "";
  const rawEmail = typeof raw.email === "string" ? raw.email : "";
  const rawSubject = typeof raw.subject === "string" ? raw.subject : "";
  const rawMessage = typeof raw.message === "string" ? raw.message : "";

  const name = sanitizeSingleLine(rawName);
  const email = sanitizeSingleLine(rawEmail).toLowerCase();
  const rawSubjectSanitized = sanitizeSingleLine(rawSubject);
  const message = rawMessage.trim();

  // Email validation
  if (!email) {
    errors.email = "Email address is required.";
  } else if (email.length > 254) {
    errors.email = "Email address must not exceed 254 characters.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Name validation
  if (name.length > 100) {
    errors.name = "Name must not exceed 100 characters.";
  }

  // Subject validation
  if (rawSubjectSanitized.length > 200) {
    errors.subject = "Subject must not exceed 200 characters.";
  }

  const subject =
    rawSubjectSanitized || `Inquiry from ${name || "new contact"}`;

  // Message validation
  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length > 5000) {
    errors.message = "Message must not exceed 5000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      name,
      email,
      subject,
      message,
    },
  };
}
