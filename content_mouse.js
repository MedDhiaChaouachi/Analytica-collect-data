let mouseClicks = 0;

function handleClick(event) {
  mouseClicks++;
  console.log(`Mouse click detected: ${mouseClicks}`); // Debugging line
  try {
    chrome.runtime.sendMessage(
      {
        action: "updateMouseClicks",
        url: window.location.href,
        mouseClicks,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          console.log("Mouse clicks message sent successfully", response);
        }
      }
    );
  } catch (e) {
    console.error("Failed to send message:", e);
  }
}

document.addEventListener("click", handleClick);

console.log("Mouse click tracking content script loaded"); // Debugging line
