let formInteractions = 0;

function handleFormInteraction() {
  formInteractions++;
  console.log(`Form interaction detected: ${formInteractions}`); // Debugging line
  try {
    chrome.runtime.sendMessage(
      {
        action: "updateFormInteractions",
        url: window.location.href,
        formInteractions,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          console.log("Form interactions message sent successfully", response);
        }
      }
    );
  } catch (e) {
    console.error("Failed to send message:", e);
  }
}

// Add submit event listener to all forms
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    handleFormInteraction();
  });

  // Add click event listener to all submit buttons within forms
  form.querySelectorAll("[type='submit']").forEach((button) => {
    button.addEventListener("click", () => {
      handleFormInteraction();
    });
  });
});

console.log("Form interactions tracking content script loaded"); // Debugging line
