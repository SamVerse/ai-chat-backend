export function validateMessage(input: unknown): string {
  if (typeof input !== "string") {
    throw new Error("Invalid message");
  }

  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Message cannot be empty");
  }

  if (trimmed.length > 1000) {
    return trimmed.slice(0, 1000);
  }

  return trimmed;
}
