import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./Detail.module.css";

const TMDB_API_KEY = "8d075e0772042d0c424c05ee251929be";

// ✅ TMDB 장르 매핑 (영문 통일)
const TMDB_GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

// ✅ 포스터/배경 기본 이미지
const FALLBACK_IMG =
  "https://res.cloudinary.com/dy1xcx7kw/image/upload/v1729430065/no-poster-dark_jongflix.jpg";

function Detail() {
  const { id } = useParams();
  const location = useLocation();
  const isTmdbMode = location.pathname.startsWith("/tmdb/");
  const [movie, setMovie] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState("");
  const [reviews, setReviews] = useState([]);
  const [providers, setProviders] = useState([]);

  const fetchReviews = async (tmdbId) => {
    try {
      let res = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}/reviews?api_key=${TMDB_API_KEY}&language=ko-KR`
      );
      let json = await res.json();
      if (!json.results?.length) {
        res = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdbId}/reviews?api_key=${TMDB_API_KEY}&language=en-US`
        );
        json = await res.json();
      }
      setReviews(json.results?.slice(0, 3) || []);
    } catch {
      setReviews([]);
    }
  };

  const loadYtsMovie = async () => {
    try {
      const res = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`);
      const json = await res.json();
      const ytsMovie = json.data.movie;

      setMovie({
        title: ytsMovie.title,
        year: ytsMovie.year,
        rating: ytsMovie.rating,
        runtime: ytsMovie.runtime,
        description_full: ytsMovie.description_full,
        genres: ytsMovie.genres || [],
        background_image_original: ytsMovie.background_image_original,
        medium_cover_image: ytsMovie.medium_cover_image,
        yt_trailer_code: ytsMovie.yt_trailer_code || null,
      });

      if (ytsMovie.genres?.length > 0) {
        const res2 = await fetch(
          `https://yts.mx/api/v2/list_movies.json?limit=6&genre=${ytsMovie.genres[0]}&minimum_rating=8`
        );
        const recJson = await res2.json();
        setSimilarMovies(recJson.data.movies || []);
      }

      const tmdbSearch = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          ytsMovie.title
        )}&year=${ytsMovie.year}`
      );
      const tmdbJson = await tmdbSearch.json();

      if (tmdbJson.results?.length) {
        const tmdbId = tmdbJson.results[0].id;
        const creditRes = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`
        );
        const creditJson = await creditRes.json();
        const directorData = creditJson.crew?.find((c) => c.job === "Director");
        setDirector(directorData ? directorData.name : "");
        setCast(creditJson.cast?.slice(0, 5) || []);
        fetchReviews(tmdbId);

        try {
          const providerRes = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`
          );
          const providerJson = await providerRes.json();
          const kr = providerJson.results?.KR;
          const available = [];
          const names = ["Netflix", "Disney Plus", "Watcha", "Wavve"];
          if (kr?.flatrate?.length) {
            for (const p of kr.flatrate) {
              if (names.includes(p.provider_name)) {
                available.push(p.provider_name);
              }
            }
          }
          setProviders(available);
        } catch (err) {
          console.error("플랫폼 확인 실패:", err);
        }
      }
    } catch {}
  };

  const loadTmdbMovie = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=ko-KR`
      );
      const tmdbMovie = await res.json();

      let trailer = null;
      try {
        const resVideos = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=ko-KR`
        );
        const videosJson = await resVideos.json();
        trailer = videosJson.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
      } catch {}

      // ✅ 수정된 부분 — 장르 영어 변환
      setMovie({
        title: tmdbMovie.title,
        year: tmdbMovie.release_date?.split("-")[0],
        rating: tmdbMovie.vote_average,
        runtime: tmdbMovie.runtime,
        description_full: tmdbMovie.overview,
        genres: tmdbMovie.genres?.map((g) => TMDB_GENRES[g.id] || g.name) || [],
        background_image_original: tmdbMovie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`
          : "",
        medium_cover_image: tmdbMovie.poster_path
          ? `https://image.tmdb.org/t/p/w342${tmdbMovie.poster_path}`
          : "",
        yt_trailer_code: trailer ? trailer.key : null,
      });

      const creditRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`
      );
      const creditJson = await creditRes.json();
      const directorData = creditJson.crew?.find((c) => c.job === "Director");
      setDirector(directorData ? directorData.name : "");
      setCast(creditJson.cast?.slice(0, 5) || []);
      fetchReviews(id);

      try {
        const providerRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`
        );
        const providerJson = await providerRes.json();
        const kr = providerJson.results?.KR;
        const available = [];
        const names = ["Netflix", "Disney Plus", "Watcha", "Wavve"];
        if (kr?.flatrate?.length) {
          for (const p of kr.flatrate) {
            if (names.includes(p.provider_name)) {
              available.push(p.provider_name);
            }
          }
        }
        setProviders(available);
      } catch (err) {
        console.error("플랫폼 확인 실패:", err);
      }
    } catch {}
  };

  useEffect(() => {
    isTmdbMode ? loadTmdbMovie() : loadYtsMovie();
  }, [id]);

  if (!movie)
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    );

  return (
    <div className={styles.detail}>
      {/* 🎞 상단 배너 */}
      <div
        className={styles.banner}
        style={{
          backgroundColor:
            !movie.background_image_original ||
            movie.background_image_original.trim() === ""
              ? "#000"
              : "transparent",
        }}
      >
        {movie.background_image_original &&
        movie.background_image_original.trim() !== "" ? (
          <img
            src={movie.background_image_original}
            alt={movie.title}
            className={styles.bg}
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div className={styles.fallbackBg}></div>
        )}
        <div className={styles.overlay}></div>

        <div className={styles.info}>
          {/* ✅ 포스터 fallback 개선 */}
          <img
            src={
              movie.medium_cover_image &&
              movie.medium_cover_image.trim() !== "" &&
              movie.medium_cover_image.trim() !== "null"
                ? movie.medium_cover_image
                : FALLBACK_IMG
            }
            alt=""
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMG;
            }}
          />
          <div className={styles.text}>
            <h1>{movie.title}</h1>
            <p className={styles.meta}>
              {movie.year} • ⭐ {movie.rating} / 10 • {movie.runtime} min
            </p>
            <ul className={styles.genres}>
              {movie.genres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 🎬 영화 소개 */}
      <div className={styles.section}>
        <h2>영화 소개</h2>
        {movie.description_full ? (
          <>
            <p className={`${styles.description} ${expanded ? styles.expanded : ""}`}>
              {movie.description_full}
            </p>
            {movie.description_full?.length > 300 && (
              <button
                className={styles.toggleBtn}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "접기 ▲" : "더보기 ▼"}
              </button>
            )}
          </>
        ) : (
          <p className={styles.emptyText}>등록된 영화 소개가 없습니다.</p>
        )}
      </div>

      {/* 🎥 감독 & 출연진 */}
      <div className={styles.section}>
        <h2>감독 & 출연진</h2>
        {(!director && cast.length === 0) ? (
          <p className={styles.emptyText}>감독 & 출연진 정보가 없습니다.</p>
        ) : (
          <>
            <p><strong>감독:</strong> {director || "정보 없음"}</p>
            <ul className={styles.castList}>
              {cast.map((actor) => (
                <li key={actor.id}>
                  {actor.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                    />
                  )}
                  <p>{actor.name}</p>
                  <p className={styles.character}>({actor.character})</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 💬 리뷰 & 평론 */}
      <div className={styles.section}>
        <h2>리뷰 & 평론</h2>
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div key={r.id} className={styles.reviewCard}>
              <p className={styles.reviewAuthor}>✍ {r.author}</p>
              <p className={styles.reviewContent}>
                {r.content.length > 200 ? r.content.slice(0, 200) + "..." : r.content}
              </p>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>등록된 리뷰 & 평론이 없습니다.</p>
        )}
      </div>

      {/* 🎧 트레일러 */}
      <div className={styles.section}>
        <h2>Trailer</h2>
        {movie.yt_trailer_code ? (
          <div className={styles.videoWrapperFull}>
            <iframe
              src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className={styles.emptyText}>트레일러가 없습니다.</p>
        )}
      </div>

      {/* 🎞 시청 가능한 플랫폼 */}
      {providers.length > 0 && (
        <div className={styles.section}>
          <h2>시청 가능한 플랫폼</h2>
          <div className={styles.platforms}>
            {providers.includes("Netflix") && (
              <a
                href={`https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.platformBtn} ${styles.netflix}`}
              >
                Netflix에서 보기
              </a>
            )}
            {providers.includes("Disney Plus") && (
              <a
                href={`https://www.disneyplus.com/ko-kr/search/${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.platformBtn} ${styles.disney}`}
              >
                Disney+에서 보기
              </a>
            )}
            {providers.includes("Watcha") && (
              <a
                href={`https://watcha.com/ko-KR/search?query=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.platformBtn} ${styles.watcha}`}
              >
                Watcha에서 보기
              </a>
            )}
            {providers.includes("Wavve") && (
              <a
                href={`https://www.wavve.com/search?query=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.platformBtn} ${styles.wavve}`}
              >
                Wavve에서 보기
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
