# AnalyTica Browsing Behavior Tracker

AnalyTica is a Chrome extension designed to track and analyze user browsing activity. It monitors various browsing behaviors such as time spent on websites, mouse clicks, scroll depth, form interactions, page load times, and the number of times a user switches between tabs. The data collected is displayed in a popup interface with visual charts to help users understand their browsing patterns.

## Features

- **Track Time Spent on Websites**: Monitors the time spent on each website and generates a report.
- **Track Mouse Clicks**: Counts the number of mouse clicks on websites.
- **Track Scroll Depth**: Monitors how far down a user scrolls on each webpage.
- **Track Form Interactions**: Counts interactions with forms on websites.
- **Track Page Load Time**: Measures the page load time for each website visited.
- **Tab Switches**: Tracks the number of times a user switches between tabs.
- **Visual Reports**: Displays the data collected in the form of bar, doughnut, and polar area charts.

## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing this extension.
5. The extension should now be installed and active in your browser.

## Permissions

The extension requires the following permissions:

- `history`: To track the user's browsing history.
- `tabs`: To track tab activities and determine which websites are being visited.
- `storage`: To store data locally for later use.
- `idle`: To detect when the user is idle or active.
- `activeTab`: To interact with the currently active tab.

## How It Works

### Background Script

The background script (`background.js`) handles the tracking of user activity across different tabs:

- **Tab Visits**: Tracks the time spent on each website, the number of visits, and switches between tabs.
- **Idle Detection**: Detects when the user becomes idle or active to pause or resume tracking.
- **Data Storage**: The tracked data is stored locally using `chrome.storage.local`.

### Content Scripts

The content scripts handle the tracking of user interactions on each webpage:

- **Mouse Clicks** (`content_mouse.js`): Tracks the number of mouse clicks on the webpage.
- **Scroll Depth** (`content_scroll.js`): Monitors the scroll depth of the user on each webpage.
- **Form Interactions** (`content_form.js`): Tracks interactions with forms (submit or click) on the webpage.
- **Page Load Time** (`content_load_time.js`): Measures how long it takes for the page to load.

### Popup Interface

The popup (`popup.html`) provides a user-friendly interface that displays the collected data:

- **Charts**: Displays visual reports of the tracked data, including time spent, visit switches, and mouse clicks.
- **History List**: Shows a detailed list of websites visited, with associated data such as time spent, switches, scroll depth, and more.

### Data Handling

- **Time Spent**: The extension tracks the amount of time spent on each website.
- **Visit Count**: Tracks how many times a user visits a website.
- **Switches**: Tracks how many times a user switches between tabs while browsing.
- **Scroll Depth**: Tracks the maximum percentage of the page the user has scrolled.
- **Mouse Clicks**: Counts the number of mouse clicks on each webpage.
- **Form Interactions**: Counts how many times a form is interacted with (submitted or button clicked).
- **Page Load Time**: Measures the time it takes for the page to load.

## Charts

- **Time Spent Chart**: Displays a bar chart showing the percentage of time spent on each website.
- **Visits and Switches Chart**: Displays a doughnut chart showing the combined percentage of visits and tab switches for each website.
- **Mouse Clicks Chart**: Displays a polar area chart showing the number of mouse clicks on each website.

## Data Storage

The extension uses `chrome.storage.local` to store the collected data, ensuring that the data persists between sessions. The data is saved in a format that includes:

- URL of the visited website
- Time spent on the website
- Visit count
- Tab switches
- Scroll depth
- Mouse clicks
- Form interactions
- Page load time

## How to Use

1. Once the extension is installed, click the extension icon in the browser toolbar to open the popup.
2. The popup will display the visual reports and the browsing history.
3. The data is updated in real-time as the user interacts with websites.
4. You can analyze the charts and history list to understand your browsing behavior.

## Troubleshooting

- **No Data Showing**: Ensure the extension has permission to access your browsing history and tabs.
- **Charts Not Displaying**: Make sure the extension is tracking data by checking the console logs for any errors.
- **Idle Detection**: The extension pauses tracking when the user is idle, so ensure you are actively browsing for data collection.


## License
feel free to use 
