import time
import pyautogui
import pyperclip
from selenium import webdriver
from selenium.webdriver.common.by import By


# Chrome 브라우저 실행
driver = webdriver.Chrome()

# Naver Login 접속
driver.get("https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/")
driver.implicitly_wait(10)
driver.maximize_window()

# ID 입력
elem = driver.find_element(By.CSS_SELECTOR, '#id')
elem.click()
pyperclip.copy("ID 입력")
pyautogui.hotkey("ctrl","v")

# PW 입력
elem = driver.find_element(By.CSS_SELECTOR, '#pw')
elem.click()
pyperclip.copy("PW 입력")
pyautogui.hotkey("ctrl","v")

# Login 버튼 클릭
elem = driver.find_element(By.CSS_SELECTOR, '#log\.login').click()
time.sleep(2)

# 메일함 이동
driver.get("https://mail.naver.com/v2/folders/0/all")
driver.implicitly_wait(10)

# 메일 쓰기 클릭
driver.find_element(By.CSS_SELECTOR, ".item.button_write").click()
time.sleep(2)


# 이메일 작성
elem = driver.find_element(By.CSS_SELECTOR, "#recipient_input_element").click
pyperclip.copy("whdrms125@naver.com")
pyautogui.hotkey("ctrl", "v")
time.sleep(2)


# 이메일 제목 작성
elem = driver.find_element(By.CSS_SELECTOR, "#subject_title").send_keys("Test Title")
time.sleep(2)

# 본문 입력 (iframe 전환 후)
iframe = driver.find_element(By.CSS_SELECTOR, "#content > div.contents_area > div > div.editor_area > div > div.editor_body > iframe")
driver.switch_to.frame(iframe)

elem = driver.find_element(By.CSS_SELECTOR, 'body > div > div.workseditor-body > div.workseditor-content')
elem.click()
pyperclip.copy("1234")
pyautogui.hotkey("ctrl", "v")
time.sleep(1)

# 다시 메인 페이지로 돌아와서 전송
driver.switch_to.default_content()
elem = driver.find_element(By.CSS_SELECTOR, '#content > div.mail_toolbar.type_write > div:nth-child(1) > div > button.button_write_task').click()
time.sleep(2)

print("✅ 메일 전송 완료")

