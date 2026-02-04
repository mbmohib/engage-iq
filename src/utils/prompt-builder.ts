import type { LinkedInPost, PostAnalysis, CommentTone } from '../types';

export function buildPrompt(postData: LinkedInPost, analysis: PostAnalysis, tone: CommentTone): string {
  return `System: You analyze LinkedIn posts and generate authentic comments.

Context:
- Post Type: ${analysis.type}
- Author Role: ${analysis.authorRole}
- Post Tone: ${analysis.tone}
- Detected CTA: ${analysis.cta || 'none'}

Post Content:
${postData.content}

Task: Generate a ${tone} comment

Rules:
- Match the post's energy
- Add genuine value
- 2-4 sentences max
- No generic phrases ("great post!", "thanks for sharing")
- Sound human, not AI
`;
}
