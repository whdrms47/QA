import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By

try:
    # 현재 시간 저장
    now = time.strftime('%Y_%m_%d_%Hh_%Mm')

    result_pass_list = []  # 성공한 테스트케이스 리스트
    result_fail_list = []  # 실패한 테스트케이스 리스트
    fail_reason_list = []  # 실패 사유 리스트
    tc_count = 7  # 총 테스트 케이스 수

    # 테스트 결과 저장 폴더 생성
    if not os.path.exists('test_result'):
        os.makedirs('test_result')

    f = open(f'./test_result/{now}_Test_report.txt', 'w', encoding='utf-8')

    driver = webdriver.Chrome()
    driver.get('https://www.cgv.co.kr')
    driver.implicitly_wait(10)

    try:
        tc_id = 'TC_001'
        cgv_url = driver.current_url
        if cgv_url == 'https://www.cgv.co.kr/':
            print('CGV 메인 페이지 접속 성공.')
            result_pass_list.append(tc_id)
        else:
            print(cgv_url)
            print('CGV 메인 페이지 접속 실패.')
            result_fail_list.append(tc_id)
            fail_reason_list.append('CGV 메인 페이지 접속 실패.')
    except Exception as e:
        print(f'TC_001 실행 실패 >>> {e}')

    try:
        tc_id = 'TC_002-003'
        elem = driver.find_element(By.CSS_SELECTOR, '#header_keyword')
        elem.click()
        elem.send_keys('28tu9w8g')

        driver.find_element(By.CSS_SELECTOR, '#btn_header_search').click()
        driver.implicitly_wait(10)

        elem = driver.find_element(By.CSS_SELECTOR, '#search_result')
        origin_text = "'28tu9w8g' 검색결과가 없습니다."
        
        if origin_text == elem.text.strip():
            print('존재하지 않는 영화 검색 결과 확인 성공.')
            result_pass_list.append(tc_id)
        else:
            print('존재하지 않는 영화 검색 결과 확인 실패.')
            result_fail_list.append(tc_id)
            fail_reason_list.append('존재하지 않는 영화 검색 결과 확인 실패.')
    except Exception as e:
        print(f'TC_002 실행 실패 >>> {e}')
    try:
        tc_id = 'TC_004'
        elem = driver.find_element(By.CSS_SELECTOR, '#header_keyword')
        elem.click()
        elem.send_keys('썬더볼츠')
        driver.find_element(By.CSS_SELECTOR, '#btn_header_search').click()
        driver.implicitly_wait(10)

        elem = driver.find_element(By.CSS_SELECTOR, '#searchMovieResult > strong')
        if elem.text.strip().startswith('영화검색 결과'):
            print('한글 영화 검색 결과 확인 성공.')
            result_pass_list.append(tc_id)
        else:
            print('한글 영화 검색 결과 확인 실패.')
            result_fail_list.append(tc_id)
            fail_reason_list.append('한글글 영화 검색 결과 확인 실패.')
    except Exception as e:
        print(f'TC_002-003 실행 실패 >>> {e}')
    try:
        tc_id = 'TC_005'
        elem = driver.find_element(By.CSS_SELECTOR, '#header_keyword')
        elem.click()
        elem.send_keys('mission impossible')
        driver.find_element(By.CSS_SELECTOR, '#btn_header_search').click()
        driver.implicitly_wait(10)

        elem = driver.find_element(By.CSS_SELECTOR, '#searchMovieResult > strong')
        if elem.text.strip().startswith('영화검색 결과'):
            print('영어 영화 검색 결과 확인 성공.')
            result_pass_list.append(tc_id)
        else:
            print('영어 영화 검색 결과 확인 실패.')
            result_fail_list.append(tc_id)
            fail_reason_list.append('영어어 영화 검색 결과 확인 실패.')
    except Exception as e:
        print(f'TC_002-003 실행 실패 >>> {e}')

    try:
        tc_id = 'TC_006'
        elem = driver.find_element(By.CSS_SELECTOR, '#header_keyword')
        elem.click()
        elem.send_keys("@@##!!")

        driver.find_element(By.CSS_SELECTOR, '#btn_header_search').click()
        driver.implicitly_wait(10)


        elem = driver.find_element(By.CSS_SELECTOR, '#contents > div > div > ul > li > img')

        if elem.is_displayed():
            print("존재하지 않는 특수문자 영화 검색 성공.")
            result_pass_list.append(tc_id)
        else :
            print("존재하지 않는 특수문자 영화 검색 실패.")
            result_fail_list.append(tc_id)
            fail_reason_list.append('존재하지 않는 특수문자 영화 검색 실패.')
    except Exception as e:
        print(f'TC_006 실행 실패 >>> {e}')

    try:
        tc_id = 'TC_007'
        elem = driver.find_element(By.CSS_SELECTOR, '#header_keyword')
        elem.click()
        elem.send_keys("범죄도시")
        driver.find_element(By.CSS_SELECTOR, '#btn_header_search').click()
        driver.implicitly_wait(10)

        driver.find_element(By.CSS_SELECTOR, '#searchMovieResult > ul > li:nth-child(1) > a > img').click()
        driver.implicitly_wait(10)

        elem = driver.find_element(By.CSS_SELECTOR, '#menu > div.col-detail > ul')

        if elem.is_displayed():
            print("영화 상세 정보 페이지 진입 성공.")
            result_pass_list.append(tc_id)
        else :
            print("영화 상세 정보 페이지 진입 실패.")
            result_fail_list.append(tc_id)
            fail_reason_list.append('영화 상세 정보 페이지 진입 실패.')
    except Exception as e:
        print(f'TC_007 실행 실패 >>> {e}')       

    try:
        tc_id = 'TC_008'
        driver.find_element(By.CSS_SELECTOR, '#cgvwrap > div.header > div.header_content > div > h1 > a > img').click()
        driver.implicitly_wait(10)
        elem = driver.find_element(By.CSS_SELECTOR, '#contaniner > div.noticeClient_wrap > div > div.noticeClient_container > div.qr_wrap > div > img')
        
        if elem.is_displayed():
            print('메인페이지 이동 성공.')  # 의도: 이미지가 보이면 실패로 처리
            result_pass_list.append(tc_id)
        else:
            print('메인페이지 이동 실패.')
            result_fail_list.append(tc_id)
            fail_reason_list.append('메인페이지 이동 실패.')

    except Exception as e:
        print(f'TC_008 실행 실패 >>> {e}')

except Exception as e:
    print(f'전체 테스트 실행 실패!! >>> {e}')

# 결과 저장
f.write(f'테스트 실행 일시 : {now}\n')
f.write(f'\n[RESULT - PASS]\n')
for tc in result_pass_list:
    f.write(f'{tc}\n')

f.write(f'\n[RESULT - FAIL]\n')
for i in range(len(result_fail_list)):
    f.write(f'{result_fail_list[i]}\n')
    f.write(f'\t사유: {fail_reason_list[i]}\n')

f.write('====================\n')
f.write(f'PASS TC COUNT : {len(result_pass_list)}\n')
f.write(f'FAIL TC COUNT : {len(result_fail_list)}\n')
f.write(f'COMPLETED TEST COUNT : {len(result_pass_list) + len(result_fail_list)}\n')
f.write(f'PROGRESS OF TEST : {((len(result_pass_list) + len(result_fail_list))/tc_count)*100:.2f}%\n')
f.write(f'PASS RATE : {(len(result_pass_list)/tc_count)*100:.2f}%\n')
f.close()