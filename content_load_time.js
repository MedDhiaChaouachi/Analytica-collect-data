window.addEventListener("load", () => {
  let pageLoadTime;

  // Use PerformanceNavigationTiming if available
  const [navigationEntry] = performance.getEntriesByType("navigation");

  if (
    navigationEntry &&
    navigationEntry instanceof PerformanceNavigationTiming
  ) {
    pageLoadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;
  } else {
    // Fallback for browsers that do not support PerformanceNavigationTiming
    const timing = performance.timing;
    pageLoadTime = timing.loadEventEnd - timing.navigationStart;
  }

  console.log(`Page load time: ${pageLoadTime} ms`);

  chrome.runtime.sendMessage(
    {
      action: "updatePageLoadTime",
      url: window.location.href,
      pageLoadTime,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
      } else {
        console.log("Page load time message sent successfully", response);
      }
    }
  );
});
