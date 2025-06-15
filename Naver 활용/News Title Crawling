from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# 검색어 입력
keyword = input("검색어를 입력하세요: ")

# 웹 드라이버 실행
driver = webdriver.Chrome()

try:
    driver.get("https://www.naver.com")
    time.sleep(1)

    # 검색어 입력 및 검색 실행
    search_input = driver.find_element(By.ID, "query")
    search_input.send_keys(keyword)
    search_input.send_keys(Keys.RETURN)
    time.sleep(2)

    # 뉴스 탭 클릭
    news_tab = driver.find_element(By.LINK_TEXT, '뉴스')
    news_tab.click()
    time.sleep(2)

    # 뉴스 제목 크롤링
    news_titles = driver.find_elements(By.CSS_SELECTOR, 'span.sds-comps-text.sds-comps-text-ellipsis.sds-comps-text-ellipsis-1.sds-comps-text-type-headline1')

    if not news_titles:
        print("❗ 뉴스 제목 요소를 찾지 못했습니다. 페이지 구조를 다시 확인하세요.")
    else:
        print(f"\n📌 '{keyword}' 뉴스 결과:")
        for i, title in enumerate(news_titles, 1):
            print(f"{i}. {title.text}")

finally:
    driver.quit()
