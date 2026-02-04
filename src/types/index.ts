export type LLMTier = 'budget' | 'standard' | 'premium';

export type LLMProvider = 'openai' | 'anthropic';

export type PostType = 
  | 'thought_leadership' 
  | 'announcement' 
  | 'opinion' 
  | 'question' 
  | 'celebration';

export type PostTone = 
  | 'celebratory' 
  | 'serious' 
  | 'controversial' 
  | 'supportive' 
  | 'professional';

export type AuthorRole = 
  | 'founder' 
  | 'engineer' 
  | 'recruiter' 
  | 'marketer' 
  | 'vc' 
  | 'professional';

export type CommentTone = 'professional' | 'casual' | 'bold';

export interface LinkedInPost {
  content: string;
  author: {
    name: string;
    designation: string;
  };
  metadata: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface PostAnalysis {
  type: PostType;
  tone: PostTone;
  authorRole: AuthorRole;
  cta: string | null;
}

export interface CommentVariant {
  text: string;
  tone: CommentTone;
}

export interface LLMProviderConfig {
  provider: LLMProvider;
  model: string;
}

export interface ChromeMessage {
  type: string;
  data?: unknown;
}

export interface Settings {
  apiKeys?: {
    openai?: string;
    anthropic?: string;
  };
  selectedTier?: LLMTier;
  preferences?: {
    autoInsert?: boolean;
    defaultTone?: CommentTone;
  };
}
