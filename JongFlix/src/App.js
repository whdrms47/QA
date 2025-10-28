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

function Header({ onInfoClick }) {
  const location = useLocation();

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/home") {
      window.location.replace("/home"); 
    } else {
      window.location.replace("/home"); 
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/home" className={styles.logo} onClick={handleLogoClick}>
        JongFlix
      </Link>

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
          <Route path="/" exact component={Landing} />

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
