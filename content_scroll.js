let maxScrollDepth = 0;

function calculateScrollDepth() {
  const scrollDepth = window.scrollY + window.innerHeight;
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );

  const scrollPercentage = (scrollDepth / documentHeight) * 100;
  if (scrollPercentage > maxScrollDepth) {
    maxScrollDepth = scrollPercentage;
    console.log(`Updated scroll depth: ${maxScrollDepth}%`); // Debugging line
    chrome.runtime.sendMessage(
      {
        action: "updateScrollDepth",
        url: window.location.href,
        scrollDepth: maxScrollDepth,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          console.log("Scroll depth message sent successfully", response);
        }
      }
    );
  }
}

// Use a mutation observer to handle dynamic content loading
const observer = new MutationObserver(calculateScrollDepth);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

window.addEventListener("scroll", calculateScrollDepth);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetScrollDepth") {
    maxScrollDepth = 0;
    console.log("Scroll depth reset"); // Debugging line
  }
});

console.log("Scroll tracking content script loaded"); // Debugging line
