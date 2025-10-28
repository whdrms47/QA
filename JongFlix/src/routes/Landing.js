import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Landing.module.css";

const TMDB_API_KEY = "8d075e0772042d0c424c05ee251929be"; // 🔐 교체하세요

function Landing() {
  const [poster, setPoster] = useState(null);
  const [title, setTitle] = useState("");
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale(1)");
  const [shine, setShine] = useState("");
  const [hovered, setHovered] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const getKTrend = async () => {
      // 최근 2년 기준으로 국내 트렌드 + 최신 작품 위주
      const since = new Date();
      since.setFullYear(since.getFullYear() - 2);
      const sinceStr = since.toISOString().slice(0, 10);

      try {
        const url =
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}` +
          `&language=ko-KR&region=KR&sort_by=popularity.desc&include_adult=false&include_video=false` +
          `&primary_release_date.gte=${sinceStr}&vote_count.gte=100&with_original_language=ko`;
        const res = await fetch(url);
        const json = await res.json();
        const list = json?.results || [];

        if (list.length) {
          // 상위 트렌드 중 하나를 랜덤 추천
          const pick = list[Math.floor(Math.random() * Math.min(list.length, 20))];
          setPoster(pick?.poster_path
            ? `https://image.tmdb.org/t/p/w780${pick.poster_path}`
            : null);
          setTitle(pick?.title || pick?.original_title || "");
          return;
        }
      } catch (e) {
        console.error("TMDB 추천 로드 실패:", e);
      }

      // ⛑️ 백업: 기존 YTS 최신작
      try {
        const res = await fetch(
          "https://yts.mx/api/v2/list_movies.json?minimum_rating=8&sort_by=year"
        );
        const json = await res.json();
        const movies = json?.data?.movies || [];
        if (movies.length) {
          const m = movies[Math.floor(Math.random() * movies.length)];
          setPoster(m.large_cover_image);
          setTitle(m.title);
        }
      } catch (e) {
        console.error("YTS 백업 로드 실패:", e);
      }
    };

    getKTrend();
  }, []);

  const handleMouseMove = (e) => {
    if (!hovered) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const maxTilt = 12;
    const rx = ((y - cy) / cy) * maxTilt * -1;
    const ry = ((x - cx) / cx) * maxTilt;

    setTransform(`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.05)`);

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setShine(
      `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.35), rgba(255,255,255,0.1) 20%, transparent 60%)`
    );
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    setTransform("rotateX(0deg) rotateY(0deg) scale(1)");
    setShine("");
  };

  return (
    <div className={styles.landing}>
      {poster && (
        <div className={styles.hero}>
          {/* 포스터 */}
          <div
            className={styles.posterWrapper}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform }}
          >
            <div
              className={`${styles.shineLayer} ${hovered ? styles.active : ""}`}
              style={{ background: shine }}
            />
            <img src={poster} alt={title} className={styles.poster} />
          </div>

          {/* 정보 박스 */}
          <div className={styles.info}>
            <h1 className={styles.logo}>JongFlix</h1>
            <h2 className={styles.movieTitle}>
              {title ? `오늘의 추천 영화: ${title}` : ""}
            </h2>
            <p className={styles.subtitle}>
              최신 인기 영화를 한 곳에서 확인하세요.
              <br />
              다양한 장르의 정보를 수집할 수 있습니다.
            </p>
            <button
              className={styles.enterBtn}
              onClick={() => history.push("/home")}
            >
              지금 입장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
