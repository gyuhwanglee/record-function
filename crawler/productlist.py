import json
import os
import random
import re
import time
from collections import defaultdict
from typing import Dict, Any, List

import requests
from bs4 import BeautifulSoup

from collector.site.util import create_directory

PRODUCT_LIST_PATH = "data/product_list"
PRODUCT_DETAIL_PATH = "data/product_detail"
PRODUCT_DETAIL_RAW_PATH = "data/product_detail/raw"

BASE_API = "https://site.com/v1"
PACKAGE_INFO_API = f"{BASE_API}/usrcsrv/activity/rail/presale/info" \
                   f"?activity_id={{activity_id}}"  # activity_id required
PRODUCT_DETAIL_API = f"{BASE_API}/usrcsrv/packages/{{package_id}}/base/published" \
                     f"?preview=0&translation=false"  # package_id required
REVIEW_API = f"{BASE_API}/experiencesrv/activity/component_service/best_latest_review" \
             f"?activity_id={{activity_id}}&preview=0"

SCHEDULE_API = f"https://www.site.com/v2/usrcsrv/packages/schedules_and_units" \
               f"?package_id={{package_id}}&preview=0"

PKG_OPTION_MAPPING = {
    "예약확정": "confirm_booking",
    "취소 규정": "cancellation_policy",
    "포함사항": "inclusion",
    "불포함사항": "exclusion",
    "일정": "schedule",
    "이용요건": "condition",
    "추가정보": "additional_info",
    "바우처 종류": "voucher_type",
    "사용(교환) 유효기간": "valid_duration",
    "사용 정보 (교환 정보)": "how_to_use",
    "미팅정보": "meeting_information",
    "운영시간": "operating_time",
    "가는방법": "meeting_point_method",
}


def collect_data(origin: List[Dict[str, Any]], result: defaultdict) -> Dict[str, Any]:
    for o in origin:
        title = ""
        for obj in o["data"].get("render_obj", []):
            if obj["type"] == "title":
                title = PKG_OPTION_MAPPING.get(obj["content"])
                if title is None:
                    break
            elif obj["type"] == "item":
                result[title].append(obj["content"])
    return dict(result)


def get_product_detail(data: Dict[str, Any]):
    print(f"Processing {data['id']}: {data['name']}")

    resp = requests.get(PACKAGE_INFO_API.format(activity_id=data["id"])).json()
    if not resp["success"]:
        print(f"Package API call failed: {data['id']}")
        return

    review_resp = requests.get(REVIEW_API.format(activity_id=data["id"])).json()
    if not review_resp["success"]:
        print(f"Review API call failed: {data['id']}")
        return
    review = review_resp.get("result", {})
    if review is None:
        review = {}

    # Data to collect
    product_data = {
        "channel_name": "SITENAME",  # fixed
        "product_link": data["url"],
        "partner_id": "",
        "partner_name": "Unknown",
        "partner_contact": "Unknown",
        "rate": review.get("score") or data["rate"],
        "review_count": review.get("review_count", 0),
        "product_code": data["id"],
        "product_name": "",
        "product_category": "",
        "city": data["city_name"],
        "product_main_contents": [],
        "product_detail": {},
        "list_price": "",
        "selling_price": "",
        "option": {},
        "option_price": {},
        "tags": data["tags"],
        "summary": [],
    }

    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/97.0.4692.71 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip,deflate,br',
        'Connection': 'keep-alive'}
    cookies = {}

    html_data = requests.get(data['url'], headers=headers, cookies=cookies).text
    # print(html_data)
    if "vam" not in html_data:
        # This means collecting is blocked
        print("!!! Collecting is blocked !!!")
        return False

    print("HTML data collected. Start parsing....")
    html = BeautifulSoup(html_data, "lxml").body
    __site__ = ""
    scripts = html.find_all("script")
    for s in scripts:
        t = s.getText()
        if t and "__site__" in t:
            __site__ = t

    # Product name
    product_data["product_name"] = html.select(".vam")[0].getText().strip()

    product_category_list = html.find_all(class_="klk-breadcrumb-inner")[0].find_all(class_="klk-breadcrumb-item")
    product_data["product_category"] = " > ".join([x.a.contents[0].strip() for x in product_category_list])

    # Main contents
    contents_host = "https://res.site.com/image/upload"
    main_contents = re.findall(r"banner_list:\[{.*?}]", __site__)[0].replace("\\u002F", "/")
    main_contents = re.findall(r"suffix:\".*?\"", main_contents)
    product_data["product_main_contents"] = [{"type": "image", "url": f"{contents_host}/{x[8:-1]}"} for x in
                                             main_contents]

    # Product Detail
    product_detail = {}

    ## highlight
    highlight_data = ""
    highlight = html.find("div", {"id": "highlight"})

    if highlight:
        highlight_data = [x.getText() for x in highlight.find_all("li")]
    # print(highlight)
    product_detail["highlight"] = highlight_data

    ## summary
    summary_data = []
    summary = html.select(".experience-section-item.activity_icons")
    if summary:
        summary = summary[0].select(".activity-icons_item")
    # print(summary)
    for s in summary:
        summary_data.append(s.getText().strip())
    product_data["summary"] = summary_data

    ## story
    story_data = {
        "title": "",
        "contents": [],
    }
    summary = html.find("div", {"id": "activity_summary"})
    title = summary.find("div", {"title": "매력포인트"})
    if title:
        title = title.getText()
    else:
        title = ""
    story_data["title"] = title
    desc_list = summary.find("div", {"class": "dynamic-image"})

    for desc in desc_list:
        img = desc.find("noscript").find("img")["src"]
        caption = desc.find("span").getText() if desc.find("caption") else ""
        story_data["contents"].append({"image": img, "caption": caption})
    product_detail["story"] = story_data

    ## tip
    tip_data = []
    tip = html.find("div", {"id": "Things_to_note"})
    if tip:
        tip = tip.find("div", {"title": "매력포인트"})
        for t in tip.find_all("li"):
            tip_data.append(t.getText())

    product_detail["tip"] = tip_data

    ## address
    addr = re.findall(r"\[{place_id:.*?image_url.*?}]", __site__)[0]
    img = re.findall(r"image_url:\".*?\"", addr)[0].split(":", maxsplit=1)[1][1:-1].replace("\\u002F", "/")
    product_detail["address"] = img

    ## faq
    try:
        faq = re.findall(r"faq:\[{question:.*?\"}]", __site__)[0][4:]
        faq_data = json.loads(faq.replace('question', '"question"').replace('answer', '"answer"'))
    except:
        faq_data = []
    product_detail["faq"] = faq_data

    # price
    selling_price = (html.select(".price-package-selling-price")[0].getText()
                     .replace("₩", "").strip().split(" ")[0].replace(",", ""))
    list_price = html.select(".price-package-marketPrice")
    if not list_price:
        list_price = selling_price
    else:
        list_price = list_price[0].getText().replace("₩", "").strip().split(" ")[0].replace(",", "")

    product_data["list_price"] = list_price
    product_data["selling_price"] = selling_price

    # Get detail data from API
    package_info = resp["result"]
    # print(package_info)
    packages = package_info["packages"]
    if packages:
        package_id = packages[0]["package_id"]

        detail_resp = requests.get(PRODUCT_DETAIL_API.format(package_id=package_id),
                                   headers={"accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"}).json()
        if not detail_resp["success"]:
            print(f"Product detail API call failed: {package_id}")
            return
        detail = detail_resp["result"][0]

        product_data["partner_id"] = detail["merchant_id"]
        detail_origin = []
        terms_origin = []
        how_to_use_origin = []

        for section in detail["section_content"]["sections"]:
            if section["title"] == "패키지 상세설명":
                detail_origin = section["components"]
            elif section["title"] == "이용약관":
                terms_origin = section["components"]
            elif section["title"] == "사용방법":
                how_to_use_origin = section["components"]

        ## detail
        product_detail["detail"] = collect_data(detail_origin, defaultdict(list))

        ## terms
        product_detail["terms"] = collect_data(terms_origin, defaultdict(list))

        ## how_to_use
        product_detail["how_to_use"] = collect_data(how_to_use_origin, defaultdict(list))

    # pprint(product_detail)
    product_data["product_detail"] = product_detail

    with open(f"{PRODUCT_DETAIL_PATH}/{data['id']}.json", "w") as f:
        json.dump(product_data, f, ensure_ascii=False, indent=2)


def get_all_product_detail():
    create_directory(PRODUCT_DETAIL_PATH)
    create_directory(PRODUCT_DETAIL_RAW_PATH)

    latest_file = max([x for x in os.listdir(PRODUCT_LIST_PATH) if os.path.isfile(f"{PRODUCT_LIST_PATH}/{x}")])
    with open(f"{PRODUCT_LIST_PATH}/{latest_file}", "r") as f:
        product_list = json.loads(f.read())
    print(f"{len(product_list)} Products are on the list")

    random.shuffle(product_list)  # shuffle for randomness
    for product in product_list:
        time.sleep(random.random() * 10)  # sleep for randomness
        get_product_detail(product)
        # DISCUSS: for loop is broken due to channel's blocking
        break


if __name__ == "__main__":
    get_all_product_detail()
