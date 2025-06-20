import time
from selenium import webdriver
from selenium.webdriver.common.by import By
import chromedriver_autoinstaller

# Chrome 드라이버 설치 및 초기화
chromedriver_autoinstaller.install()
driver = webdriver.Chrome()

# 1. naver 이동
driver.get("https://www.naver.com")
time.sleep(1)

# 2. google 이동
driver.get("https://www.google.com")
time.sleep(1)

# 3. 뒤로가기
driver.back()
time.sleep(1)

# 4. 앞으로가기
driver.forward()
time.sleep(2)

# 5. 새로고침
driver.refresh()
time.sleep(2)

# 종료 안내
print("✅ 동작 완료! 수고하셨습니다.")
input("엔터를 누르면 브라우저가 종료됩니다.")
driver.quit()
