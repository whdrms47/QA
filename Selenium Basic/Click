import time
from selenium import webdriver
from selenium.webdriver.common.by import By
import chromedriver_autoinstaller

# 크롬드라이버 자동 설치
chromedriver_autoinstaller.install()

# 브라우저 실행
driver = webdriver.Chrome()
driver.get("https://www.naver.com")

# 페이지 로딩 대기
time.sleep(3)

# 뉴스스탠드 상단 메뉴 요소 선택자
nav_selector = "#newsstand > div.ContentHeaderView-module__content_header___nSgPg > div > ul"

# 요소 찾기
nav_element = driver.find_element(By.CSS_SELECTOR, nav_selector)

# 요소의 텍스트 출력
print("뉴스스탠드 메뉴 텍스트:")
print(nav_element.text)

# 요소 클릭 (예시 목적)
nav_element.click()

# 브라우저 닫기 전에 약간 대기
time.sleep(2)
driver.quit()
