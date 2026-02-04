import { describe, it, expect } from 'vitest';
import { analyzePost } from '../../src/utils/post-analyzer';
import type { LinkedInPost } from '../../src/types';

describe('Post Analyzer', () => {
  describe('detectAuthorRole', () => {
    it('should detect founder from designation', () => {
      const post: LinkedInPost = {
        content: 'Test content',
        author: {
          name: 'John Doe',
          designation: 'Founder & CEO at TechCorp'
        },
        metadata: { likes: 0, comments: 0, shares: 0 }
      };

      const result = analyzePost(post);
      expect(result.authorRole).toBe('founder');
    });

    it('should detect engineer from designation', () => {
      const post: LinkedInPost = {
        content: 'Test content',
        author: {
          name: 'Jane Smith',
          designation: 'Senior Software Engineer at Google'
        },
        metadata: { likes: 0, comments: 0, shares: 0 }
      };

      const result = analyzePost(post);
      expect(result.authorRole).toBe('engineer');
    });

    it('should detect recruiter from designation', () => {
      const post: LinkedInPost = {
        content: 'Test content',
        author: {
          name: 'Mike Johnson',
          designation: 'Technical Recruiter at Meta'
        },
        metadata: { likes: 0, comments: 0, shares: 0 }
      };

      const result = analyzePost(post);
      expect(result.authorRole).toBe('recruiter');
    });

    it('should detect marketer from designation', () => {
      const post: LinkedInPost = {
        content: 'Test content',
        author: {
          name: 'Sarah Lee',
          designation: 'Head of Growth Marketing at Stripe'
        },
        metadata: { likes: 0, comments: 0, shares: 0 }
      };

      const result = analyzePost(post);
      expect(result.authorRole).toBe('marketer');
    });

    it('should detect VC from designation', () => {
      const post: LinkedInPost = {
        content: 'Test content',
        author: {
          name: 'David Chen',
          designation: 'Partner at Sequoia Capital'
        },
        metadata: { likes: 0, comments: 0, shares: 0 }
      };

      const result = analyzePost(post);
      expect(result.authorRole).toBe('vc');
    });

    it('should default to professional for unknown roles', () => {
      const post: LinkedInPost = {
        content: 'Test content',
        author: {
          name: 'Alice Brown',
          designation: 'Sales Manager at RandomCorp'
        },
        metadata: { likes: 0, comments: 0, shares: 0 }
      };

      const result = analyzePost(post);
      expect(result.authorRole).toBe('professional');
    });

    it('should be case insensitive', () => {
      const post: LinkedInPost = {
        content: 'Test content',
        author: {
          name: 'Bob Wilson',
          designation: 'CO-FOUNDER at StartupXYZ'
        },
        metadata: { likes: 0, comments: 0, shares: 0 }
      };

      const result = analyzePost(post);
      expect(result.authorRole).toBe('founder');
    });
  });

  describe('analyzePost structure', () => {
    it('should return complete analysis object', () => {
      const post: LinkedInPost = {
        content: 'Excited to announce our Series A!',
        author: {
          name: 'Emily Zhang',
          designation: 'CEO at NewCo'
        },
        metadata: { likes: 500, comments: 50, shares: 20 }
      };

      const result = analyzePost(post);

      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('tone');
      expect(result).toHaveProperty('authorRole');
      expect(result).toHaveProperty('cta');
      expect(result.authorRole).toBe('founder');
    });
  });
});
