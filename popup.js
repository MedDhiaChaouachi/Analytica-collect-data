function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ action: "getHistory" }, (response) => {
    const historyList = document.getElementById("history-list");
    const timeChartCtx = document.getElementById("timeChart").getContext("2d");
    const visitSwitchChartCtx = document
      .getElementById("visitSwitchChart")
      .getContext("2d");
    const mouseClicksChartCtx = document
      .getElementById("mouseClicksChart")
      .getContext("2d");

    historyList.innerHTML = "";
    const labels = [];
    const timeData = [];
    const visitSwitchData = [];
    const mouseClicksData = [];
    const colors = [];

    for (const [url, siteData] of Object.entries(response)) {
      labels.push(url);
      timeData.push(siteData.timeSpent);
      visitSwitchData.push(siteData.visitCount + (siteData.switches || 0));
      mouseClicksData.push(siteData.mouseClicks || 0);
      colors.push(getRandomColor());

      const listItem = document.createElement("li");
      listItem.textContent = `URL: ${url} - Visits: ${
        siteData.visitCount
      } - Time spent: ${formatTime(siteData.timeSpent)} - Switches: ${
        siteData.switches || 0
      } - Scroll Depth: ${(siteData.scrollDepth || 0).toFixed(
        2
      )}% - Mouse Clicks: ${siteData.mouseClicks || 0} - Form Interactions: ${
        siteData.formInteractions || 0
      } - Page Load Time: ${siteData.pageLoadTime || 0} ms`;
      historyList.appendChild(listItem);
    }

    // Total time spent
    const totalSpent = timeData.reduce((sum, value) => sum + value, 0);
    const timeChartData = timeData.map((time) => (time / totalSpent) * 100);

    // Create the time spent bar chart
    new Chart(timeChartCtx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Time Spent (%)",
            data: timeChartData,
            backgroundColor: colors,
            borderColor: colors.map((color) =>
              color.replace(/[^,]+(?=\))/, "1")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
        },
      },
    });

    // Total visits and switches
    const totalVisitsSwitches = visitSwitchData.reduce(
      (sum, value) => sum + value,
      0
    );
    const visitSwitchChartData = visitSwitchData.map(
      (count) => (count / totalVisitsSwitches) * 100
    );

    // Create the visits and switches doughnut chart
    new Chart(visitSwitchChartCtx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Visits + Switches (%)",
            data: visitSwitchChartData,
            backgroundColor: colors,
            borderColor: colors.map((color) =>
              color.replace(/[^,]+(?=\))/, "1")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Combined Visits and Switches",
          },
        },
      },
    });

    // Create the mouse clicks polar area chart with raw number of clicks
    new Chart(mouseClicksChartCtx, {
      type: "polarArea",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Mouse Clicks",
            data: mouseClicksData,
            backgroundColor: colors,
            borderColor: colors.map((color) =>
              color.replace(/[^,]+(?=\))/, "1")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Mouse Clicks",
          },
        },
      },
    });
  });
});
