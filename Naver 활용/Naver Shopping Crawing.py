from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import json

# 검색어 입력
product = input("검색어를 입력하세요: ")

# 웹 드라이버 실행
driver = webdriver.Chrome()

driver.get("https://shopping.naver.com/ns/home/logistics")
time.sleep(3)

# 검색어 입력 및 검색 실행
search_input = driver.find_element(By.CSS_SELECTOR, "#gnb-gnb > div._gnb_header_area_nfFfz > div > div._gnbContent_gnb_content_JUwjU > div._gnbSearch_gnb_search_ULxKx > form > div > div > div > div > input")
search_input.send_keys(product)
search_input.send_keys(Keys.RETURN)
time.sleep(2)



# 제품 링크 element들 가져오기
product_links = driver.find_elements(By.CSS_SELECTOR, 'a.productCardResponsive_link__iQkFo')

for link in product_links[:10]:  # 상위 10개 예시
    data_raw = link.get_attribute("data-shp-contents-dtl")
    
    # JSON 파싱
    data = json.loads(data_raw)
    
    # Key 추출 (상품 이름, 가격)
    for item in data:
        if item['key'] == 'chnl_prod_nm':
            title = item['value']
        elif item['key'] == 'price':
            price = item['value']


    print(f"🛒 {title}\n💰 가격: {price}\n")

driver.quit()
