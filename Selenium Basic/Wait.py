import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://www.naver.com")
time.sleep(1)

# 3. Driver Wait
# 3-1. 3초 때 로딩이 끝나서, element가 찾아짐.
# 3-2. 30초까지는 기다림
# 3-3. 30초 넘어가면 에러던짐.
try:
    selector = "#newsstand > div.ContentHeaderSubView-module__content_header_sub___Yszwk > div.ContentHeaderSubView-module__sub_news___DECMU > a"
    WebDriverWait(driver, 30).until(EC.presence_if_element_located(By.CSS_SELECTOR, selector))
except:
    print("예외 발생, 예외 처리 코드 실행")
print("엘리먼트 로딩 끝")
