import { scrapeLinkedInPost } from "./scraper";
import "./styles.css";

function injectEngageIQButton(): void {
  const posts = document.querySelectorAll('[data-urn*="urn:li:activity"]');

  posts.forEach(post => {
    if (post.querySelector(".engageiq-button")) return;

    const button = document.createElement("button");
    button.className = "engageiq-button";
    button.innerHTML = "⚡ EngageIQ";
    button.addEventListener("click", () => handlePostClick(post));

    const postHeader = post.querySelector(".feed-shared-actor");
    if (postHeader) {
      postHeader.appendChild(button);
    }
  });
}

function handlePostClick(postElement: Element): void {
  const postData = scrapeLinkedInPost(postElement);

  chrome.runtime.sendMessage({
    type: "OPEN_SIDE_PANEL",
    postData,
  });

  chrome.sidePanel?.open?.({ windowId: chrome.windows.WINDOW_ID_CURRENT });
}

const observer = new MutationObserver(() => {
  injectEngageIQButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

injectEngageIQButton();
