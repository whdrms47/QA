import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  useLocation,
} from "react-router-dom";
import Home from "./routes/Home";
import Detail from "./routes/Detail";
import Landing from "./routes/Landing";
import styles from "./App.module.css";

// ✅ Header 컴포넌트 (로고 클릭 시 완전한 홈 리셋)
function Header({ onInfoClick }) {
  const location = useLocation();

  const handleLogoClick = (e) => {
    e.preventDefault();

    // ✅ 모든 상태 초기화된 홈으로 강제 이동
    if (location.pathname === "/home") {
      window.location.replace("/home"); // 홈일 경우도 리셋
    } else {
      window.location.replace("/home"); // 다른 경로에서도 동일하게 완전 리로드
    }
  };

  return (
    <header className={styles.header}>
      {/* ✅ 기존 Link 유지 + onClick 추가 */}
      <Link to="/home" className={styles.logo} onClick={handleLogoClick}>
        JongFlix
      </Link>

      {/* Info 버튼 */}
      <button className={styles.infoBtn} onClick={onInfoClick}>
        i
      </button>
    </header>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Router>
      <div className={styles.app}>
        <Switch>
          {/* ✅ 랜딩 페이지 */}
          <Route path="/" exact component={Landing} />

          {/* ✅ 홈 & 디테일 */}
          <Route>
            <Header onInfoClick={() => setShowModal(true)} />

            <main>
              <Switch>
                <Route path="/home" exact component={Home} />
                <Route path="/movie/:id" component={Detail} />
                <Route path="/tmdb/:id" component={Detail} />
                <Redirect to="/" />
              </Switch>
            </main>

            {/* ✅ 모달 그대로 유지 */}
            {showModal && (
              <div
                className={styles.modalOverlay}
                onClick={() => setShowModal(false)}
              >
                <div
                  className={styles.modal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                  <h2>서비스 안내</h2>
                  <p>• JongFlix에 오신 여러분을 환영합니다!</p>
                  <p>• JongFlix는 평점 8 또는 9를 기준으로 영화를 추천합니다.</p>
                  <p>• 당신의 휴가를 JongFlix로 알차게 준비하세요!</p>
                </div>
              </div>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
