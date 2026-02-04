import type { LinkedInPost, PostAnalysis, PostType, PostTone, AuthorRole } from '../types';

export function analyzePost(postData: LinkedInPost): PostAnalysis {
  const type = detectPostType(postData.content);
  const tone = detectTone(postData.content);
  const authorRole = detectAuthorRole(postData.author.designation);
  
  return {
    type,
    tone,
    authorRole,
    cta: detectCTA(postData.content)
  };
}

function detectPostType(content: string): PostType {
  return 'thought_leadership';
}

function detectTone(content: string): PostTone {
  return 'professional';
}

function detectAuthorRole(designation: string): AuthorRole {
  const rolePatterns: Record<AuthorRole, RegExp> = {
    founder: /founder|co-founder|ceo|entrepreneur/i,
    engineer: /engineer|developer|swe|software/i,
    recruiter: /recruiter|talent|hr|hiring/i,
    marketer: /marketing|growth|content|brand/i,
    vc: /investor|vc|venture|partner/i,
    professional: /./i
  };
  
  for (const [role, pattern] of Object.entries(rolePatterns)) {
    if (role !== 'professional' && pattern.test(designation)) {
      return role as AuthorRole;
    }
  }
  
  return 'professional';
}

function detectCTA(content: string): string | null {
  return null;
}
