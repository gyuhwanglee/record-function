const puppeteer = require('puppeteer');

async function runCrawler() {
  // Puppeteer를 통해 브라우저를 실행합니다.
  const browser = await puppeteer.launch();

  // 새로운 페이지를 엽니다.
  const page = await browser.newPage();

  // 네이버 로그인 페이지로 이동합니다.
  await page.goto('https://nid.naver.com/nidlogin.login');

  // 로그인 폼에 아이디와 비밀번호를 입력합니다.
  await page.type('#id', 'your_username'); // 여기에 사용자명 또는 이메일을 입력하세요.
  await page.type('#pw', 'your_password'); // 여기에 비밀번호를 입력하세요.

  // 로그인 버튼을 클릭합니다.
  await page.click('.btn_login');

  // 로그인 후에 대시보드 또는 다른 페이지로 이동하는 로직을 작성합니다.
  // 예시로 대시보드 페이지로 이동하는 코드를 추가합니다.
  await page.waitForNavigation();
  await page.goto('https://www.naver.com');

  // 페이지 스크린샷을 찍거나 데이터를 수집하는 로직을 작성합니다.
  // 예시로 페이지 스크린샷을 찍는 코드를 추가합니다.
  await page.screenshot({ path: 'naver_dashboard.png' });

  // 작업이 완료되었으므로 브라우저를 종료합니다.
  await browser.close();
  console.log('1231231');
}

runCrawler();

const puppeteer = require('puppeteer');

async function runCrawler() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://scm.kkday.com/v1/en/auth/login');
  await page.video.start({ path: 'recorded_video.webm' });
  // 로그인 폼이 나타날 때까지 대기합니다.
  // await page.waitForSelector('#input-email');
  await page.click('#loginBtn');
  // 로그인 폼에 아이디와 비밀번호를 입력합니다.
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'id'); // 여기에 이메일을 입력하세요.
  await page.type('input[type="password"]', 'password'); // 여기에 비밀번호를 입력하세요.
  // await page.screenshot({ path: 'kkday_dashboard.png' });
  // // 로그인 버튼을 클릭합니다.

  // // 로그인 후에 대시보드 또는 다른 페이지로 이동하는 로직을 작성합니다.
  // // 예시로 대시보드 페이지로 이동하는 코드를 추가합니다.
  await page.click('.panel-confirm-button button');
  // await page.waitForNavigation();
  await page.goto('https://scm.kkday.com/v1/en/dashboard');
  await page.video.stop();

  // // 페이지 스크린샷을 찍거나 데이터를 수집하는 로직을 작성합니다.
  // // 예시로 페이지 스크린샷을 찍는 코드를 추가합니다.
  await page.screenshot({ path: 'kkday_dashboard.png' });

  await browser.close();
  console.log('11111');
}

runCrawler();
