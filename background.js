let historyData = {};
let currentTabId = -1;
let currentTabStartTime = new Date().getTime();
let sessionStartTime = new Date().getTime();
let isIdle = false;

chrome.storage.local.get("historyData", (result) => {
  if (result.historyData) {
    historyData = result.historyData;
  }
});

function updateCurrentTabTime() {
  if (currentTabId !== -1 && !isIdle) {
    chrome.tabs.get(currentTabId, (tab) => {
      if (tab && tab.url && tab.active) {
        const url = new URL(tab.url).href;
        const now = new Date().getTime();
        if (historyData[url]) {
          historyData[url].timeSpent += (now - currentTabStartTime) / 1000; // time in seconds
          currentTabStartTime = now; // reset tab start time
          chrome.storage.local.set({ historyData: historyData });
        }
      }
    });
  }
}

// Update tab time every second
setInterval(updateCurrentTabTime, 1000);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    const url = new URL(tab.url).href;
    if (!historyData[url]) {
      historyData[url] = {
        visitCount: 0,
        timeSpent: 0,
        switches: 0,
        scrollDepth: 0,
        mouseClicks: 0,
        formInteractions: 0,
        pageLoadTime: 0,
      };
    }
    historyData[url].visitCount += 1;
    chrome.storage.local.set({ historyData: historyData });

    // Reset start time for the new updated tab
    currentTabStartTime = new Date().getTime();
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // Update time spent on the previous tab
  updateCurrentTabTime();

  currentTabId = activeInfo.tabId;
  currentTabStartTime = new Date().getTime(); // Reset start time for the new active tab

  chrome.tabs.get(currentTabId, (tab) => {
    if (tab && tab.url) {
      const url = new URL(tab.url).href;
      if (!historyData[url]) {
        historyData[url] = { visitCount: 0, timeSpent: 0, switches: 0 };
      }
      historyData[url].switches = (historyData[url].switches || 0) + 1;
      chrome.storage.local.set({ historyData: historyData });
    }
  });
});

chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === "idle" || newState === "locked") {
    isIdle = true;
  } else if (newState === "active") {
    isIdle = false;
    currentTabStartTime = new Date().getTime(); // Reset start time after coming back from idle
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getHistory") {
    updateCurrentTabTime(); // Ensure the latest time spent is updated before sending response
    sendResponse(historyData);
  } else if (request.action === "updateMouseClicks") {
    const url = new URL(request.url).href;
    if (historyData[url]) {
      historyData[url].mouseClicks = request.mouseClicks;
      chrome.storage.local.set({ historyData: historyData }, () => {
        console.log(`Mouse clicks updated for ${url}: ${request.mouseClicks}`); // Debugging line
        sendResponse({ success: true });
      });
    } else {
      console.log(`URL not found in historyData: ${url}`); // Debugging line
      sendResponse({ success: false });
    }
    return true; // Keeps the message channel open for sendResponse
  } else if (request.action === "updateScrollDepth") {
    const url = new URL(request.url).href;
    if (historyData[url]) {
      historyData[url].scrollDepth = request.scrollDepth;
      chrome.storage.local.set({ historyData: historyData }, () => {
        console.log(`Scroll depth updated for ${url}: ${request.scrollDepth}%`); // Debugging line
        sendResponse({ success: true });
      });
    } else {
      console.log(`URL not found in historyData: ${url}`); // Debugging line
      sendResponse({ success: false });
    }
    return true; // Keeps the message channel open for sendResponse
  } else if (request.action === "updateFormInteractions") {
    const url = new URL(request.url).href;
    if (historyData[url]) {
      historyData[url].formInteractions = request.formInteractions;
      chrome.storage.local.set({ historyData: historyData }, () => {
        console.log(
          `Form interactions updated for ${url}: ${request.formInteractions}`
        ); // Debugging line
        sendResponse({ success: true });
      });
    } else {
      console.log(`URL not found in historyData: ${url}`); // Debugging line
      sendResponse({ success: false });
    }
    return true; // Keeps the message channel open for sendResponse
  } else if (request.action === "updatePageLoadTime") {
    const url = new URL(request.url).href;
    if (historyData[url]) {
      historyData[url].pageLoadTime = request.pageLoadTime;
      chrome.storage.local.set({ historyData: historyData }, () => {
        console.log(
          `Page load time updated for ${url}: ${request.pageLoadTime} ms`
        ); // Debugging line
        sendResponse({ success: true });
      });
    } else {
      console.log(`URL not found in historyData: ${url}`); // Debugging line
      sendResponse({ success: false });
    }
    return true; // Keeps the message channel open for sendResponse
  }
});
