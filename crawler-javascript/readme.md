# Code Snippet 1: Naver Login and Screenshot

This code snippet uses Puppeteer to automate the process of logging into Naver and capturing a screenshot of the dashboard.

## Launching the Browser: The puppeteer.launch() function is called to launch a new instance of the browser.

Opening a New Page: The browser.newPage() function creates a new page.
Naver Login: The page navigates to the Naver login page (https://nid.naver.com/nidlogin.login), and the username and password are entered using the page.type() function.
Clicking the Login Button: The page.click() function is used to click the login button.
Navigating and Taking a Screenshot: After logging in, the code waits for navigation to complete using page.waitForNavigation(). Then, it navigates to the Naver homepage (https://www.naver.com) and captures a screenshot using page.screenshot().
Closing the Browser: Finally, the browser is closed using browser.close().

# Code Snippet 2: KKday Login and Screenshot

This code snippet automates the process of logging into the KKday website and capturing a screenshot of the dashboard.

## Launching the Browser: The puppeteer.launch() function is called with the headless: 'new' option to launch the browser in a non-headless mode. This allows you to see the browser window.

Opening a New Page: A new page is created using browser.newPage().
KKday Login: The page navigates to the KKday login page (https://scm.kkday.com/v1/en/auth/login) and waits for the login form to appear. The email and password are entered using the page.type() function.
Clicking the Login Button: The login button is clicked using page.click().
Navigating and Taking a Screenshot: After login, the code waits for the login confirmation button to appear and clicks it. Then, it navigates to the KKday dashboard (https://scm.kkday.com/v1/en/dashboard) and captures a screenshot.
Closing the Browser: Finally, the browser is closed using browser.close().
Please note that you need to replace 'id' and 'password' with your actual KKday login credentials.

Feel free to include this explanation in your Readme file, making any necessary adjustments or adding further details specific to your project's requirements.
