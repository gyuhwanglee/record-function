import { coupang_data } from "./dummy_data";

const representative = document.getElementById("coupang_representative_img"); // 대표이미지
const sideTitle = document.getElementById("coupang_title"); // 상품제목
const sideAdress = document.getElementById("coupang_adress"); // 주소지
const sideDate = document.getElementById("coupang_side_date"); // 사용기간
const sidePrice = document.getElementById("coupang_price"); // 가격
const sidePriceStandard = document.getElementById("coupang_price_standard"); // 가격기준
const sidePromotion = document.getElementById("coupang_promotion"); //이 상품 예약시 혜택
const sidedDescription = document.getElementById("coupang_description"); // 바로사용, 티켓타입, 사용방법, 예약필요, 취소가능
const sideIntroduce = document.getElementById("coupang_introduce"); // 소개글
const sideNotice = document.getElementById("coupang_side_notice");// 알려드리는 말
const date = document.getElementById("coupang_date");// 상단 날짜 (검색 변경)
const productTitle = document.getElementById("coupang_product_title1");// 상품명 ( 상단 선택박스)
const productTitle2 = document.getElementById("coupang_product_title2");// 상품명 ( 상단 선택박스)
const productTitleClass = document.getElementsByClassName("ticket-summary-name");
const productTitleClass2 = document.getElementsByClassName("ticket-summary-name2");
const productPrice1 = document.getElementById("coupang_product_price1"); // 가격 (상단 선택박스)
const productPrice2 = document.getElementById("coupang_product_price2"); // 가격 (상단 선택박스)
const productDate = document.getElementById("coupang_product_date");
const productAddInfo = document.getElementById("coupang_product_addinfo"); // 추가정보 (상단 선택박스)
const productInfo = document.getElementById("coupang_product_info");
// const mainImage = document.getElementById("coupang_main_img"); // 상세페이지 메인사진
const includInfo = document.getElementById("coupang_includ");// 포함사항(사용방법)
const notIncludInfo = document.getElementById("coupang_notincluded");// 불포함사항(사용방법)
const notice = document.getElementById("coupang_notice");//유의사항(사용방법)
const companyInfo = document.getElementById("coupang_company_info"); // 예약안내 (사용방법)
const cancelInfo = document.getElementById("coupang_cancel_info");// 취소수수료안내 (취소환불규정)
const cancelNotice = document.getElementById("coupang_cancel_notice");// 취소 유의사항(취소환불규정)

document.addEventListener("DOMContentLoaded", () => {
  fieldDateHandle();
  createProductSelect();
});

const fieldDateHandle = () => {
  for (const i of coupang_data) {
    // console.log(i);
    if (i.title === "coupang_representative_img") {
      representative.src = i.contents;
    }
    if (i.title === "coupang_title") {
      sideTitle.innerHTML = i.contents;
    }
    if (i.title === "coupang_adress") {
      sideAdress.innerHTML = i.contents;
    }
    if (i.title === "coupang_side_date") {
      sideDate.innerHTML = i.contents;
    }
    if (i.title === "coupang_price") {
      sidePrice.innerHTML = i.contents;
    }
    if (i.title === "coupang_price_standard") {
      sidePriceStandard.innerHTML = i.contents;
    }
    if (i.title === "coupang_promotion") {
      sidePromotion.innerHTML = i.contents;
    }
    if (i.title === "coupang_description") {
      sidedDescription.innerHTML = i.contents;
    }
    if (i.title === "coupang_introduce") {
      sideIntroduce.innerHTML = i.contents;
    }
    if (i.title === "coupang_side_notice") {
      sideNotice.innerHTML = i.contents;
    }
    if (i.title === "coupang_date") {
      date.innerHTML = i.contents;
    }
    if (i.title === "coupang_product_title1") {
      productTitle.innerHTML = i.contents;
    }
    if (i.title === "coupang_product_price1") {
      productPrice1.innerHTML = i.contents;
    }
    if (i.title === "coupang_product_price2") {
      productPrice2.innerHTML = i.contents;
    }
    if (i.title === "coupang_product_date") {
      productDate.innerHTML = i.contents;
    }
    if (i.title === "coupang_product_info") {
      productInfo.innerHTML = i.contents;
    }
    if (i.title === "coupang_product_addinfo") {
      productAddInfo.innerHTML = i.contents;
    }
    if (i.title === "coupang_includ") {
      includInfo.innerHTML = i.contents;
    }
    if (i.title === "coupang_notincluded") {
      notIncludInfo.innerHTML = i.contents;
    }
    if (i.title === "coupang_notice") {
      notice.innerHTML = i.contents;
    }
    if (i.title === "coupang_company_info") {
      companyInfo.innerHTML = i.contents;
    }
    if (i.title === "coupang_cancel_info") {
      cancelInfo.innerHTML = i.contents;
    }
    if (i.title === "coupang_cancel_notice") {
      cancelNotice.innerHTML = i.contents;
    }
    if (i.title === "coupang_main_img") {
      const img = document.createElement("img");
      img.src = i.contents;
      document.getElementById("coupang_main_img").appendChild(img);
    }
  }
};
const createProductSelect = () => {
  for (const i of coupang_data) {
    if (i.title === "coupang_product_title") {
      const tBodyTag = document.getElementById("coupang_tbody");
      const trTag = document.createElement("TR");
      // .className = " ticket-vendor-item";
      const tdTag = document.createElement("TD");
      // .className = "travel-item-name"
      const divTag = document.createElement("DIV");
      // .className = "ticket-summary"
      const pTag = document.createElement("P");
      // .className = "ticket-summary-header"
      const spanTag = document.createElement("SPAN");
      // .className = "ticket-summary-name"
      tBodyTag.appendChild(trTag).setAttribute("class", "ticket-vendor-item");
      trTag.appendChild(tdTag).setAttribute("class", "travel-item-name");
      tdTag.appendChild(divTag).setAttribute("class", "ticket-summary");
      divTag.appendChild(pTag).setAttribute("class", "ticket-summary-header");
      pTag.appendChild(spanTag).setAttribute("class", "ticket-summary-name");
      // ticket - summary - name;

      productTitleClass[0].innerHTML = i.contents;
    }
    if (i.title === "coupang_product_price2") {
      productPrice2.innerHTML = i.contents;
    }
    if (i.title === "coupang_product_title2") {
      productTitle2.innerHTML = i.contents;
    }
  }
};



//! 1. 조건에 맞게 <br> 추가해야됨.
//! 2. 선택박스에 tag값 생성해서 넣는 함수 작성해야함.