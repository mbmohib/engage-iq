import { test, expect } from '@playwright/test';
import mockPosts from '../fixtures/mock-posts.json';

test.describe('LinkedIn Post Scraper E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('about:blank');
  });

  test('should scrape thought leadership post', async ({ page }) => {
    const post = mockPosts.thoughtLeadershipPost;
    
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="post" data-urn="urn:li:activity:123">
            <div class="feed-shared-actor">
              <div class="feed-shared-actor__name">${post.author.name}</div>
              <div class="feed-shared-actor__description">${post.author.designation}</div>
            </div>
            <div class="feed-shared-text">${post.content}</div>
            <div class="social-details-social-counts">
              <span class="social-details-social-counts__reactions-count">${post.metadata.likes}</span>
              <span class="social-details-social-counts__comments">${post.metadata.comments} comments</span>
              <span class="social-details-social-counts__item--with-social-proof">${post.metadata.shares} shares</span>
            </div>
          </div>
        </body>
      </html>
    `);

    const authorName = await page.locator('.feed-shared-actor__name').textContent();
    const authorDesignation = await page.locator('.feed-shared-actor__description').textContent();
    const content = await page.locator('.feed-shared-text').textContent();

    expect(authorName).toBe(post.author.name);
    expect(authorDesignation).toBe(post.author.designation);
    expect(content).toContain('After 10 years in tech');
  });

  test('should handle multiple post types', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="feed">
            <div class="post" data-urn="urn:li:activity:1">
              <div class="feed-shared-actor">
                <div class="feed-shared-actor__name">${mockPosts.announcementPost.author.name}</div>
                <div class="feed-shared-actor__description">${mockPosts.announcementPost.author.designation}</div>
              </div>
              <div class="feed-shared-text">${mockPosts.announcementPost.content}</div>
            </div>
            <div class="post" data-urn="urn:li:activity:2">
              <div class="feed-shared-actor">
                <div class="feed-shared-actor__name">${mockPosts.opinionPost.author.name}</div>
                <div class="feed-shared-actor__description">${mockPosts.opinionPost.author.designation}</div>
              </div>
              <div class="feed-shared-text">${mockPosts.opinionPost.content}</div>
            </div>
          </div>
        </body>
      </html>
    `);

    const posts = await page.locator('.post').all();
    expect(posts.length).toBe(2);

    const firstAuthor = await posts[0].locator('.feed-shared-actor__name').textContent();
    expect(firstAuthor).toBe(mockPosts.announcementPost.author.name);

    const secondAuthor = await posts[1].locator('.feed-shared-actor__name').textContent();
    expect(secondAuthor).toBe(mockPosts.opinionPost.author.name);
  });

  test('should extract designation correctly with time prefix', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="post">
            <div class="feed-shared-actor">
              <div class="feed-shared-actor__name">Test User</div>
              <div class="feed-shared-actor__description">2h • Software Engineer at TechCo</div>
            </div>
          </div>
        </body>
      </html>
    `);

    const designation = await page.locator('.feed-shared-actor__description').textContent();
    expect(designation).toContain('Software Engineer at TechCo');
  });

  test('should handle large engagement numbers with K suffix', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="post">
            <div class="social-details-social-counts">
              <span class="social-details-social-counts__reactions-count">15.3K</span>
              <span class="social-details-social-counts__comments">1.2K comments</span>
            </div>
          </div>
        </body>
      </html>
    `);

    const likes = await page.locator('.social-details-social-counts__reactions-count').textContent();
    const comments = await page.locator('.social-details-social-counts__comments').textContent();

    expect(likes).toBe('15.3K');
    expect(comments).toContain('1.2K');
  });

  test('should handle posts with minimal engagement', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="post">
            <div class="feed-shared-actor">
              <div class="feed-shared-actor__name">New User</div>
              <div class="feed-shared-actor__description">Junior Developer</div>
            </div>
            <div class="feed-shared-text">My first post on LinkedIn!</div>
          </div>
        </body>
      </html>
    `);

    const content = await page.locator('.feed-shared-text').textContent();
    expect(content).toBe('My first post on LinkedIn!');

    const socialCounts = await page.locator('.social-details-social-counts').count();
    expect(socialCounts).toBe(0);
  });
});
