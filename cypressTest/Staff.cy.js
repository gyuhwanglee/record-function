import uuid from 'react-uuid';
import axios from 'axios';

const TEST_ID_1 = Cypress.env('TEST_ID_1');
const TEST_ID_2 = Cypress.env('TEST_ID_2');
const TEST_ID_ONE = Cypress.env('TEST_ID_ONE');
const TEST_PW_1 = Cypress.env('TEST_PW_1');
const TEST_PW_2 = Cypress.env('TEST_PW_2');
const TEST_PW_ONE = Cypress.env('TEST_PW_ONE');
const TEST_PW_RESET = Cypress.env('TEST_PW_RESET');
const API_KEY = Cypress.env('GOOGLE_SHEET_API');
const SHEET_ID = Cypress.env('GOOGLE_SHEET_ID');
const RANGE = 'Sheet1!A2:AA';

let randomEmail = '';
let ArrResult;

const setuuid = () => {
  randomEmail = 'white' + uuid() + '@emailadress.co';
};

const handleGoogleSheet = async () => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`,
    false
  ); // 마지막 인자를 true로 설정하면 비동기적으로 요청합니다.
  xhr.send();
  expect(xhr.status).to.equal(200);

  const jsonData = JSON.parse(xhr.responseText);
  ArrResult = jsonData.values;
};

handleGoogleSheet();

const staff_connect_home = () => {
  cy.visit(`/auth/signin`);
};

const staff_signin = () => {
  cy.get('[data-cy=emailInput] > :nth-child(2)').type(TEST_ID_1);
  cy.get('[data-cy=passwordInput] > :nth-child(1)').type(TEST_PW_1);
  cy.get('[data-cy=submitBtn] > :nth-child(1)').click();
};

const staff_signup = () => {
  setuuid();
  cy.get('[data-cy=signUpBtn] > :nth-child(2)').click();
  cy.get('[data-cy=emailInput] > :nth-child(2)').type(randomEmail);
  cy.get('[data-cy=firstName] > :nth-child(2)').type('zero');
  cy.get('[data-cy=lastName] > :nth-child(2)').type('kim');
  cy.get('[data-cy=passwordInput] > :nth-child(2)  > :nth-child(1) ').type(
    TEST_PW_1
  );
  cy.get(
    '[data-cy=confirmPasswordInput] > :nth-child(2)  > :nth-child(1) '
  ).type(TEST_PW_1);
  cy.get('[data-cy=signUpCheckBox] > :nth-child(1)').click();
  cy.get('[data-cy=signupButton] > :nth-child(1)').click();
  cy.get('[data-cy=resendBtn] > :nth-child(1)').click();
};

const staff_connect_policy_page = () => {
  cy.get('[data-cy=privacyTerms] > :nth-child(1)').click();
};

const staff_connect_company_draft = () => {
  //create draft company
  cy.get('[data-cy=createCompany]  > :nth-child(1)').click();
  cy.get('[data-cy=companyName]  > :nth-child(2)').type('cypress_test_company');
  cy.get('[data-cy=companyCreateBtn]  > :nth-child(1)').click();
  cy.get('[data-cy=createSupplierBtn] > :nth-child(1)').click();
  //추후 수정
  cy.get('[data-cy=companiesWrapper]').contains('cypress_test_company').click();
};

const staff_edit_company_info = () => {
  //create draft company
  cy.get('[data-cy=createCompany]  > :nth-child(1)').click();
  cy.get('[data-cy=companyName]  > :nth-child(2)').type('cypress_test_company');
  cy.get('[data-cy=companyCreateBtn]  > :nth-child(1)').click();
  cy.get('[data-cy=createSupplierBtn] > :nth-child(1)').click();
  //추후 수정
  cy.get('[data-cy=companiesWrapper]').contains('cypress_test_company').click();
};

const staff_find_password = () => {
  cy.get('[data-cy=forgotBtn] > :nth-child(2)').click();
  cy.get('[data-cy=emailInput] > :nth-child(2)').type(TEST_ID_1);
  cy.get('[data-cy=continueBtn] > :nth-child(1)').click();
};

const staff_connect_profile = () => {
  cy.wait(2000);
  cy.visit(`/staff/detail/me`);
};

const staff_edit_profile = () => {
  cy.wait(2000);
  cy.get('[data-cy=editProfile] > :nth-child(1)').click();
  cy.get('[data-cy=TestFirstName] > :nth-child(2)').clear();
  cy.get('[data-cy=TestFirstName] > :nth-child(2)').type('zero');
  cy.get('[data-cy=TestLastName] > :nth-child(2)').clear();
  cy.get('[data-cy=TestLastName] > :nth-child(2)').type('kim');
  cy.get('[data-cy=profileNickName] > :nth-child(2)').clear();
  cy.get('[data-cy=profileNickName] > :nth-child(2)').type('ZeroKim');
  cy.get('[data-cy=jobTitle] > :nth-child(2)').clear();
  cy.get('[data-cy=jobTitle] > :nth-child(2)').type('developer');
  cy.get('[data-cy=phoneSelect] > :nth-child(1)').click();
  cy.get('[data-cy=phoneSelect]').contains('Albania +355').click();
  cy.get('[data-cy=phoneInput] > :nth-child(1)').clear();
  cy.get('[data-cy=phoneInput] > :nth-child(1)').type('010-1234-5678');
  cy.get('[data-cy=languageSelect] > :nth-child(2)').click();
  cy.get('[data-cy=languageSelect]').contains('한국어').click();
  cy.get('[data-cy=locationSelect] > :nth-child(2)').click();
  cy.get('[data-cy=locationSelect]').contains('Albania').click();
  //hubspot 종료
  // cy.get('iframe[#hubspot-conversations-iframe]')
  //   .find('button[class*=VizExIconButton__]')
  //   .click();
  cy.get('#hubspot-messages-iframe-container').invoke('remove');
  //저장
  cy.get('[data-cy=saveProfile] > :nth-child(1)').click();
  cy.wait(3000);
  //변경 내용 확인
  cy.get('[data-cy=profileInfo] > :nth-child(1)').contains('developer');
  cy.get('[data-cy=profileInfo] > :nth-child(3)').contains(
    '+355 010-1234-5678'
  );
  cy.get('[data-cy=profileInfo] > :nth-child(4)').contains('ko');
  cy.get('[data-cy=profileInfo] > :nth-child(5)').contains('AL');
  cy.get('[data-cy=editProfile] > :nth-child(1)').click();
  cy.get('[data-cy=phoneSelect] > :nth-child(1)').click();
  cy.get('[data-cy=phoneSelect]').contains('Afghanistan +93').click();
  cy.get('[data-cy=languageSelect] > :nth-child(2)').click();
  cy.get('[data-cy=languageSelect]').contains('English').click();
  cy.get('[data-cy=locationSelect] > :nth-child(2)').click();
  cy.get('[data-cy=locationSelect]').contains('Afghanistan').click();
  cy.get('[data-cy=saveProfile] > :nth-child(1)').click();
};

const staff_profile_reset_password = () => {
  cy.get('[data-cy=resetPasswordProfile] > :nth-child(1)').click();
  cy.get('[data-cy=currentPassword] > :nth-child(1)').type(TEST_PW_1);
  cy.get('[data-cy=newPassword] > :nth-child(1)').type(TEST_PW_RESET);
  cy.get('[data-cy=confirmPassword] > :nth-child(1)').type(TEST_PW_RESET);
  cy.get('[data-cy=saveBtn] > :nth-child(2)').click();
  cy.wait(3000);
  cy.get('[data-cy=resetPasswordProfile] > :nth-child(1)').click();
  cy.get('[data-cy=currentPassword] > :nth-child(1)').type(TEST_PW_RESET);
  cy.get('[data-cy=newPassword] > :nth-child(1)').type(TEST_PW_1);
  cy.get('[data-cy=confirmPassword] > :nth-child(1)').type(TEST_PW_1);
  cy.get('[data-cy=saveBtn] > :nth-child(2)').click();
  cy.wait(3000);
};

const staff_connect_staff_list = () => {
  cy.wait(2000);
  cy.visit(`/staff/list`);
};

const staff_invite_staff = () => {
  cy.get('[data-cy=inviteBtn] > :nth-child(1)').click();
  cy.get('[data-cy=emailInput] > :nth-child(2)').type(
    `white_deactivate@emailadress.co{enter}`
  );
  cy.get(
    '.permissionList > :nth-child(1) > :nth-child(2) > :nth-child(1)'
  ).click();
  cy.get(
    '.permissionList > :nth-child(1) > :nth-child(2) > :nth-child(2)'
  ).click();
  cy.get('[data-cy=sendInvite] > :nth-child(1)').click();
  //초대된 staff 확인
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `white_deactivate@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]').contains('white_deactivate@emailadress.co');
};

const staff_invite_signup = () => {
  cy.get('[data-cy=inviteBtn] > :nth-child(1)').click();
  cy.get('[data-cy=emailInput] > :nth-child(2)').type(
    `white_deactivate@emailadress.co{enter}`
  );
  cy.get(
    '.permissionList > :nth-child(1) > :nth-child(2) > :nth-child(1)'
  ).click();
  cy.get(
    '.permissionList > :nth-child(1) > :nth-child(2) > :nth-child(2)'
  ).click();
  cy.get('[data-cy=sendInvite] > :nth-child(1)').click();
  //초대된 staff 확인
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `white_deactivate@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]').contains('white_deactivate@emailadress.co');
};

const staff_edit_permission = () => {
  cy.wait(2000);
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `cypress_fe_t12@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]')
    .contains('cypress_fe_t12@emailadress.co')
    .click();
  cy.get(
    '.permissionList > :nth-child(1) > :nth-child(2) > :nth-child(2)'
  ).click();
  cy.get('[data-cy=saveBtn] > :nth-child(2)').click();
  cy.wait(5000);
  cy.get('[data-testid=staffList]')
    .contains('cypress_fe_t12@emailadress.co')
    .click();
  cy.get(
    '.permissionList > :nth-child(1) > :nth-child(2) > :nth-child(2)'
  ).click();
  cy.get('[data-cy=saveBtn] > :nth-child(2)').click();
};

const staff_choose_owner_permissions = () => {
  cy.wait(2000);
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `cypress_fe_t2@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]')
    .contains('cypress_fe_t2@emailadress.co')
    .click();
  cy.get('[data-cy=transferOwnerShip] > :nth-child(2)').click();
  cy.get('[data-cy=saveBtn] > :nth-child(2)').click();
  cy.get('[data-cy=SubmitBtn] > :nth-child(2)').click();
  cy.visit(`/auth/signin`);
  cy.get('[data-cy=emailInput] > :nth-child(2)').type(TEST_ID_2);
  cy.get('[data-cy=passwordInput] > :nth-child(1)').type(TEST_PW_2);
  cy.get('[data-cy=submitBtn] > :nth-child(1)').click();
  cy.wait(2000);
  cy.visit(`/staff/list`);
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `cypress_fe_t1@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]')
    .contains('cypress_fe_t1@emailadress.co')
    .click();
  cy.get('[data-cy=transferOwnerShip] > :nth-child(2)').click();
  cy.get('[data-cy=saveBtn] > :nth-child(2)').click();
  cy.get('[data-cy=SubmitBtn] > :nth-child(2)').click();
};

const staff_delete_staff = () => {
  cy.wait(2000);
  //초대한 staff 삭제
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `white_deactivate@emailadress.co{enter}`
  );
  cy.wait(2000);
  cy.get('tbody > :nth-child(1) > :nth-child(1) > :nth-child(1)').click();
  cy.get('[data-cy=deactivateBtn] > :nth-child(3)').click();
  cy.get('[data-cy=SubmitBtn] > :nth-child(2)').click();
};

const staff_delete_owner = () => {
  cy.wait(2000);
  cy.get('tbody > :nth-child(1) > :nth-child(1) > :nth-child(1)').click();
  cy.get('[data-cy=deactivateBtn] > :nth-child(3)').click();
  cy.get('[data-cy=SubmitBtn] > :nth-child(2)').click();
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `cypress_fe_t1@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]').contains('cypress_fe_t1@emailadress.co');
};

const staff_search_staff = () => {
  cy.wait(2000);
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `cypress_fe_t10@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]')
    .contains('cypress_fe_t10@emailadress.co')
    .click();
};

const staff_new_create_company = () => {
  cy.wait(2000);
  cy.get('[data-cy=searchInput] > :nth-child(2)').type(
    `cypress_fe_t10@emailadress.co{enter}`
  );
  cy.get('[data-testid=staffList]')
    .contains('cypress_fe_t10@emailadress.co')
    .click();
};

const staff_create_approval_company = () => {
  cy.get('[data-cy=emailInput] > :nth-child(2)').type(TEST_ID_1);
  cy.get('[data-cy=passwordInput] > :nth-child(1)').type(TEST_PW_1);
  cy.get('[data-cy=submitBtn] > :nth-child(1)').click();
  cy.get('[data-cy=createCompany]  > :nth-child(1)').click();
  cy.get('[data-cy=companyName]  > :nth-child(2)').type(
    'Approve_cypress_test_company'
  );
  cy.get('[data-cy=companyCreateBtn]  > :nth-child(1)').click();
  cy.get('[data-cy=VeriftCompany]  > :nth-child(1)').click();
  cy.get('[data-cy=businessName]  > :nth-child(2)').type('AX Inc.');
  cy.get('[data-cy=businessNumber]  > :nth-child(2)').type('123-22-1234');
  cy.get('[data-cy=ceoFirstName]  > :nth-child(2)').type('zero');
  cy.get('[data-cy=ceoLastName]  > :nth-child(2)').type('kim');
  cy.get('[data-cy=companyPhoneSelect]  > :nth-child(2)').click();
  cy.get('[data-cy=companyPhoneSelect]').contains('Albania +355').click();
  cy.get('[data-cy=companyPhoneInput]  > :nth-child(1)').type('010-1234-5678');
  cy.get('[data-cy=companyWebsite]  > :nth-child(2)').type(
    'https://www.ax-cloud.com/'
  );
  cy.wait(3000);
  cy.get('[data-cy=nextBtn]  > :nth-child(1)').click();
  cy.get('[data-cy=addressLine]  > :nth-child(2)').type(
    '13F, 349, Gangnam-daero, Seocho-gu, Seoul, Republic of Korea'
  );
  cy.get('[data-cy=addressLine2"]  > :nth-child(2)').type(
    'test_address_line_2'
  );
  cy.get('[data-cy=cityName]  > :nth-child(2)').type('Seoul');
  cy.get('[data-cy=locationSelect]  > :nth-child(2)').click();
  cy.get('[data-cy=locationSelect]').contains('Albania').click();
  cy.get('[data-cy=zipCode] > :nth-child(2)').type('06232');
  cy.wait(3000);
  cy.get('[data-cy=nextSubmitBtn] > :nth-child(2)').click();
  cy.get('[data-cy=bankCode] > :nth-child(2)').type('CZNBKRSE');
  cy.get('[data-cy=bankCodeNumber] > :nth-child(2)').type('12345-1278');
  cy.get('[data-cy=bankCodeConfirmNumber] > :nth-child(2)').type('12345-1278');
  cy.get('[data-cy=firstName] > :nth-child(2)').type('zero');
  cy.get('[data-cy=lastName] > :nth-child(2)').type('kim');
  cy.get('[data-cy=imgUpload] > :nth-child(1)').selectFile(
    { contents: 'image (1).png' },
    { force: true }
  );
  cy.wait(5000);
  cy.get('[data-cy=continueBtn] > :nth-child(2)').click();
  cy.get('.invoiceName > :nth-child(1) > :nth-child(2)').type('cypress');
  cy.get('[data-cy=lastName] > :nth-child(2)').type('test');
  cy.get('[data-cy=emailInput] > :nth-child(2) > :nth-child(1)').type(
    'test1@emailadress.co'
  );
  cy.get('[data-cy=continueBtn] > :nth-child(2)').click();
  cy.get('.refundName > :nth-child(1) > :nth-child(2)').type('cypress');
  cy.get('.refundName > :nth-child(2) > :nth-child(2)').type('test');
  cy.get('[data-cy=refundEmailInput] > :nth-child(2) > :nth-child(1)').type(
    'test2@emailadress.co'
  );
  cy.get('[data-cy=refundContinue] > :nth-child(2)').click();
  cy.get('.bookingName > :nth-child(1) > :nth-child(2)').type('cypress');
  cy.get('.bookingName > :nth-child(2) > :nth-child(2)').type('test');
  cy.get('[data-cy=bookEmail] > :nth-child(1)').type('test@emailadress.co');
  cy.get('[data-cy=bookingContinue] > :nth-child(2)').click();
  cy.get('[data-cy=imgUpload] > :nth-child(1)').selectFile(
    { contents: 'image (1).png' },
    { force: true }
  );
  cy.get('[data-cy=verificationSubmit] > :nth-child(2)').click();
};

describe(
  'staff_domain_test',
  {
    viewportWidth: 1800,
    viewportHeight: 1100,
  },
  () => {
    if (ArrResult) {
      ArrResult.forEach((dataResult, dataResultIndex) => {
        if (dataResult[1] !== undefined) {
          it(dataResult[0], () => {
            dataResult.forEach((testName, testNameIndex) => {
              if (testName === 'staff_connect_home') {
                staff_connect_home();
              } else if (testName === 'staff_signin') {
                staff_signin();
              } else if (testName === 'staff_signup') {
                staff_signup();
              } else if (testName === 'staff_connect_policy_page') {
                staff_connect_policy_page();
              }
            });
          });
        }
      });
    }
  }
);

describe(
  'staff2_domain_test',
  {
    viewportWidth: 1800,
    viewportHeight: 1100,
  },
  () => {
    it('test', () => {
      cy.visit(`/auth/signin`);
      cy.get('[data-cy=emailInput] > :nth-child(2)').type(TEST_ID_1);
      cy.get('[data-cy=passwordInput] > :nth-child(1)').type(TEST_PW_1);
      cy.get('[data-cy=submitBtn] > :nth-child(1)').click();
    });
  }
);
