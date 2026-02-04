import type { LinkedInPost } from '../types';

export function scrapeLinkedInPost(postElement: Element): LinkedInPost {
  const content = extractPostContent(postElement);
  const author = extractAuthorInfo(postElement);
  const metadata = extractMetadata(postElement);

  return {
    content,
    author,
    metadata
  };
}

function extractPostContent(postElement: Element): string {
  const contentSelectors = [
    '.feed-shared-update-v2__description',
    '.feed-shared-text',
    '.feed-shared-inline-show-more-text',
    '[data-test-id="main-feed-activity-card__commentary"]'
  ];

  for (const selector of contentSelectors) {
    const contentElement = postElement.querySelector(selector);
    if (contentElement) {
      const textContent = contentElement.textContent?.trim() || '';
      if (textContent.length > 0) {
        return cleanText(textContent);
      }
    }
  }

  return '';
}

function extractAuthorInfo(postElement: Element): { name: string; designation: string } {
  const authorContainer = postElement.querySelector('.feed-shared-actor');
  
  if (!authorContainer) {
    return { name: '', designation: '' };
  }

  const nameSelectors = [
    '.feed-shared-actor__name',
    '.feed-shared-actor__title',
    '[data-test-id="actor-name"]'
  ];

  const descriptionSelectors = [
    '.feed-shared-actor__description',
    '.feed-shared-actor__sub-description',
    '[data-test-id="actor-sub-description"]'
  ];

  let name = '';
  for (const selector of nameSelectors) {
    const nameElement = authorContainer.querySelector(selector);
    if (nameElement) {
      name = nameElement.textContent?.trim() || '';
      if (name) break;
    }
  }

  let designation = '';
  for (const selector of descriptionSelectors) {
    const descElement = authorContainer.querySelector(selector);
    if (descElement) {
      designation = descElement.textContent?.trim() || '';
      if (designation) break;
    }
  }

  return { name, designation: cleanDesignation(designation) };
}

function extractMetadata(postElement: Element): { likes: number; comments: number; shares: number } {
  const socialCountsBar = postElement.querySelector('.social-details-social-counts');
  
  let likes = 0;
  let comments = 0;
  let shares = 0;

  if (socialCountsBar) {
    const reactionCount = socialCountsBar.querySelector('.social-details-social-counts__reactions-count');
    if (reactionCount) {
      likes = parseCount(reactionCount.textContent || '0');
    }

    const commentCount = socialCountsBar.querySelector('.social-details-social-counts__comments');
    if (commentCount) {
      comments = parseCount(commentCount.textContent || '0');
    }

    const shareCount = socialCountsBar.querySelector('.social-details-social-counts__item--with-social-proof');
    if (shareCount) {
      shares = parseCount(shareCount.textContent || '0');
    }
  }

  return { likes, comments, shares };
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/…see more$/, '')
    .replace(/see less$/, '')
    .trim();
}

function cleanDesignation(designation: string): string {
  return designation
    .replace(/^\d+[wdhms]\s*•\s*/, '')
    .replace(/•.*$/, '')
    .replace(/\s*\|\s*.*$/, '')
    .trim();
}

function parseCount(countText: string): number {
  const cleaned = countText.trim().replace(/,/g, '');
  const match = cleaned.match(/[\d.]+/);
  
  if (!match) return 0;
  
  const num = parseFloat(match[0]);
  
  if (cleaned.includes('K')) return Math.round(num * 1000);
  if (cleaned.includes('M')) return Math.round(num * 1000000);
  
  return Math.round(num);
}
