import type { ChromeMessage, PostAnalysis, LinkedInPost } from '../types';

chrome.runtime.onInstalled.addListener(() => {
  console.log('EngageIQ installed');
});

chrome.runtime.onMessage.addListener((
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) => {
  if (message.type === 'ANALYZE_POST') {
    handlePostAnalysis(message.data as LinkedInPost)
      .then(sendResponse)
      .catch((error: Error) => sendResponse({ error: error.message }));
    return true;
  }
  
  if (message.type === 'GENERATE_COMMENTS') {
    handleCommentGeneration(message.data as { post: LinkedInPost; analysis: PostAnalysis })
      .then(sendResponse)
      .catch((error: Error) => sendResponse({ error: error.message }));
    return true;
  }
  
  return false;
});

async function handlePostAnalysis(postData: LinkedInPost): Promise<{ status: string; analysis: PostAnalysis }> {
  return { status: 'success', analysis: {} as PostAnalysis };
}

async function handleCommentGeneration(data: { post: LinkedInPost; analysis: PostAnalysis }): Promise<{ status: string; comments: unknown[] }> {
  return { status: 'success', comments: [] };
}
