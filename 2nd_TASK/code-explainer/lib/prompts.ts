// lib/prompts.ts
export function codeCommentPrompt(code: string) {
  return `You are a helpful AI that adds clear, concise inline comments to code.
Rewrite the code with comments explaining each important step.

Code:
\`\`\`
${code}
\`\`\`
Output: Return the code with added comments in the correct syntax.`;
}

export function codeExplainPrompt(code: string) {
  return `You are a code explainer. Explain the following code step by step in plain English.
Make it beginner-friendly and structured.

Code:
\`\`\`
${code}
\`\`\`
Output: A detailed explanation with bullet points and examples if needed.`;
}
