import { describe, it, expect, beforeEach } from "vitest";
import { scrapeLinkedInPost } from "../../src/content/scraper";

describe("LinkedIn Post Scraper", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("extractPostContent", () => {
    it("should extract post content from feed-shared-text", () => {
      container.innerHTML = `
        <div class="post">
          <div class="feed-shared-text">
            This is a test post about AI and technology.
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.content).toBe(
        "This is a test post about AI and technology."
      );
    });

    it("should clean up extra whitespace", () => {
      container.innerHTML = `
        <div class="post">
          <div class="feed-shared-text">
            This    is   a    test   post.
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.content).toBe("This is a test post.");
    });

    it('should remove "see more" suffix', () => {
      container.innerHTML = `
        <div class="post">
          <div class="feed-shared-text">
            This is a long post…see more
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.content).toBe("This is a long post");
    });

    it("should return empty string if no content found", () => {
      container.innerHTML = `<div class="post"></div>`;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.content).toBe("");
    });
  });

  describe("extractAuthorInfo", () => {
    it("should extract author name and designation", () => {
      container.innerHTML = `
        <div class="post">
          <div class="feed-shared-actor">
            <div class="feed-shared-actor__name">John Doe</div>
            <div class="feed-shared-actor__description">Founder at TechCorp</div>
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.author.name).toBe("John Doe");
      expect(result.author.designation).toBe("Founder at TechCorp");
    });

    it("should clean designation by removing time prefix", () => {
      container.innerHTML = `
        <div class="post">
          <div class="feed-shared-actor">
            <div class="feed-shared-actor__name">Jane Smith</div>
            <div class="feed-shared-actor__description">2h • Senior Engineer at Google</div>
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.author.designation).toBe("Senior Engineer at Google");
    });

    it("should clean designation by removing extra info after bullet", () => {
      container.innerHTML = `
        <div class="post">
          <div class="feed-shared-actor">
            <div class="feed-shared-actor__name">Mike Johnson</div>
            <div class="feed-shared-actor__description">CEO at StartupCo • Following</div>
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.author.designation).toBe("CEO at StartupCo");
    });

    it("should return empty strings if author container not found", () => {
      container.innerHTML = `<div class="post"></div>`;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.author.name).toBe("");
      expect(result.author.designation).toBe("");
    });
  });

  describe("extractMetadata", () => {
    it("should extract likes, comments, and shares", () => {
      container.innerHTML = `
        <div class="post">
          <div class="social-details-social-counts">
            <span class="social-details-social-counts__reactions-count">150</span>
            <span class="social-details-social-counts__comments">25 comments</span>
            <span class="social-details-social-counts__item--with-social-proof">10 shares</span>
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.metadata.likes).toBe(150);
      expect(result.metadata.comments).toBe(25);
      expect(result.metadata.shares).toBe(10);
    });

    it("should parse K suffix correctly", () => {
      container.innerHTML = `
        <div class="post">
          <div class="social-details-social-counts">
            <span class="social-details-social-counts__reactions-count">2.5K</span>
            <span class="social-details-social-counts__comments">100</span>
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.metadata.likes).toBe(2500);
    });

    it("should parse M suffix correctly", () => {
      container.innerHTML = `
        <div class="post">
          <div class="social-details-social-counts">
            <span class="social-details-social-counts__reactions-count">1.2M</span>
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.metadata.likes).toBe(1200000);
    });

    it("should return zeros if no metadata found", () => {
      container.innerHTML = `<div class="post"></div>`;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);
      expect(result.metadata.likes).toBe(0);
      expect(result.metadata.comments).toBe(0);
      expect(result.metadata.shares).toBe(0);
    });
  });

  describe("full post scraping", () => {
    it("should extract all information from a complete post", () => {
      container.innerHTML = `
        <div class="post">
          <div class="feed-shared-actor">
            <div class="feed-shared-actor__name">Sarah Williams</div>
            <div class="feed-shared-actor__description">3d • VP of Engineering at Meta</div>
          </div>
          <div class="feed-shared-text">
            Excited to share that we just launched our new AI feature!
            This has been months of hard work by an amazing team.
          </div>
          <div class="social-details-social-counts">
            <span class="social-details-social-counts__reactions-count">1.5K</span>
            <span class="social-details-social-counts__comments">89 comments</span>
            <span class="social-details-social-counts__item--with-social-proof">45 shares</span>
          </div>
        </div>
      `;

      const result = scrapeLinkedInPost(container.querySelector(".post")!);

      expect(result.author.name).toBe("Sarah Williams");
      expect(result.author.designation).toBe("VP of Engineering at Meta");
      expect(result.content).toContain("Excited to share");
      expect(result.content).toContain("amazing team");
      expect(result.metadata.likes).toBe(1500);
      expect(result.metadata.comments).toBe(89);
      expect(result.metadata.shares).toBe(45);
    });
  });
});
