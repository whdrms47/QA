import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Movie from "../components/Movie";
import styles from "./Home.module.css";

const LIMIT = 18;
const TMDB_API_KEY = "8d075e0772042d0c424c05ee251929be";

const TMDB_GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const GENRE_IDS = Object.entries(TMDB_GENRES).reduce((acc, [id, name]) => {
  acc[name] = Number(id);
  return acc;
}, {});

const GENRES = [
  "전체", "Action", "Adventure", "Animation", "Biography", "Comedy",
  "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir",
  "History", "Horror", "Music", "Musical", "Mystery", "Romance",
  "Sci-Fi", "Sport", "Thriller", "War", "Western"
];

const FALLBACK_IMG =
  "https://res.cloudinary.com/dy1xcx7kw/image/upload/v1729430065/no-poster-dark_jongflix.jpg";

const normalizeQuery = (term) =>
  term
    ? term
        .normalize("NFC")
        .replace(/\s+/g, "")
        .replace(/[^\w가-힣0-9]/g, "")
        .toLowerCase()
    : "";

const EN_KO_MAP = {
  ironman: "아이언맨",
  ironman2: "아이언맨2",
  ironman3: "아이언맨3",
  frozen: "겨울왕국",
  frozen2: "겨울왕국2",
  fantastic4: "판타스틱4",
  fantasticfour: "판타스틱4",
  kpopdemonhunters: "케이팝 데몬 헌터스",
};

const buildQueryVariants = (query) => {
  if (!query) return [];
  const set = new Set();

  const base = normalizeQuery(query);
  set.add(base);

  const spacedNum = base.replace(/([가-힣a-zA-Z])([0-9])/g, "$1 $2");
  const tightNum = base.replace(/\s+/g, "");
  set.add(spacedNum);
  set.add(tightNum);

  if (EN_KO_MAP[base]) set.add(EN_KO_MAP[base]);
  if (EN_KO_MAP[spacedNum]) set.add(EN_KO_MAP[spacedNum]);
  if (EN_KO_MAP[tightNum]) set.add(EN_KO_MAP[tightNum]);

  if (/케이팝|데몬|헌터스/.test(base)) {
    set.add("kpop demon hunters");
    set.add("k-pop demon hunters");
    set.add("kpopdemonhunters");
  }

  const hangulSpaced = base.replace(/([가-힣]{2,})([가-힣]{2,})/g, "$1 $2");
  set.add(hangulSpaced);

  return [...set].filter(Boolean);
};

function Home() {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(8);
  const [selectedGenre, setSelectedGenre] = useState("전체");
  const [sortBy, setSortBy] = useState("release_date");
  const [orderBy, setOrderBy] = useState("desc");

  const abortControllerRef = useRef(null);
  const seenRef = useRef(new Set());
  const sentinelRef = useRef(null);
  const lastQueryRef = useRef("");

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cancelOngoingRequest = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          value.trim()
        )}&language=ko-KR&region=KR&include_adult=false`
      );
      const json = await res.json();
      setSuggestions(json.results?.slice(0, 5) || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const raw = searchTerm.trim();
      if (!raw) {
        setSearchTerm("");
        setDebouncedTerm("");
        history.replace({ search: "" });
        return;
      }
      const normalized = normalizeQuery(raw);
      if (normalized === lastQueryRef.current) return;
      setDebouncedTerm(normalized);
      lastQueryRef.current = normalized;
      setShowSuggestions(false);
      const params = new URLSearchParams(location.search);
      params.set("query", normalized);
      history.replace({ search: params.toString() });
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    const normalized = normalizeQuery(title);
    setDebouncedTerm(normalized);
    lastQueryRef.current = normalized;
    const params = new URLSearchParams(location.search);
    params.set("query", normalized);
    history.replace({ search: params.toString() });
    setShowSuggestions(false);
  };

  const handleGenreClick = (genre) => {
    if (!genre) return;
    setSelectedGenre(genre);
  };

  const loadMovies = async ({ reset = false } = {}) => {
    if (loading) return;
    const controller = cancelOngoingRequest();
    const signal = controller.signal;

    try {
      setLoading(true);
      const pageNum = reset ? 1 : page;
      let merged = [];

      // 홈 초기 로드
      if (!debouncedTerm) {
        const genreId = GENRE_IDS[selectedGenre];
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}${
          selectedGenre !== "전체" ? `&with_genres=${genreId}` : ""
        }&language=ko-KR&sort_by=${sortBy}.${orderBy}&vote_average.gte=${rating}&page=${pageNum}`;

        const res = await fetch(discoverUrl, { signal });
        const json = await res.json();
        const results = json.results || [];

        merged = results.map((m) => ({
          id: m.id,
          title: m.title || m.original_title || "",
          coverImg: m.poster_path
            ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
            : FALLBACK_IMG,
          summary: m.overview || "줄거리 정보가 없습니다.",
          genres: (m.genre_ids || []).map((id) => TMDB_GENRES[id] || "기타"),
          source: "tmdb",
          popularity: m.popularity || 0,
          rating: m.vote_average || 0,
          release_date: m.release_date || "",
        }));

        const sorted = sortMovies(merged);
        if (reset) {
          setMovies(sorted);
          setPage(2);
        } else {
          setMovies((prev) => [...prev, ...sorted]);
          setPage(pageNum + 1);
        }
        setHasMore(pageNum < json.total_pages);
        setLoading(false);
        return;
      }

      // 검색 모드
      const queryVariants = buildQueryVariants(debouncedTerm);
      const collected = [];
      const seenIds = new Set();

      for (const q of queryVariants) {
        const langs = ["ko-KR", "en-US"];
        for (const lang of langs) {
          const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            q
          )}&language=${lang}&region=KR&page=1&include_adult=false`;
          const res = await fetch(url, { signal });
          const json = await res.json();
          const results = json.results || [];

          for (const m of results) {
            if (seenIds.has(m.id)) continue;
            seenIds.add(m.id);
            collected.push({
              id: m.id,
              title: m.title || m.original_title || "",
              coverImg: m.poster_path
                ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                : FALLBACK_IMG,
              summary: m.overview || "줄거리 정보가 없습니다.",
              genres: (m.genre_ids || []).map((id) => TMDB_GENRES[id] || "기타"),
              source: "tmdb",
              popularity: m.popularity || 0,
              rating: m.vote_average || 0,
              release_date: m.release_date || "",
            });

            if (m.belongs_to_collection?.id) {
              const colUrl = `https://api.themoviedb.org/3/collection/${m.belongs_to_collection.id}?api_key=${TMDB_API_KEY}&language=ko-KR`;
              const colRes = await fetch(colUrl, { signal });
              const colJson = await colRes.json();
              const parts = colJson.parts || [];
              for (const p of parts) {
                if (seenIds.has(p.id)) continue;
                seenIds.add(p.id);
                collected.push({
                  id: p.id,
                  title: p.title || p.original_title || "",
                  coverImg: p.poster_path
                    ? `https://image.tmdb.org/t/p/w342${p.poster_path}`
                    : FALLBACK_IMG,
                  summary: p.overview || "줄거리 정보가 없습니다.",
                  genres: (p.genre_ids || []).map((id) => TMDB_GENRES[id] || "기타"),
                  source: "tmdb",
                  popularity: p.popularity || 0,
                  rating: p.vote_average || 0,
                  release_date: p.release_date || "",
                });
              }
            }
          }
        }
      }

      const genreFiltered =
        selectedGenre === "전체"
          ? collected
          : collected.filter((m) => m.genres.includes(selectedGenre));

      const sorted = sortMovies(genreFiltered);
      setMovies(sorted);
      setHasMore(false);
    } catch (err) {
      if (err.name !== "AbortError") console.error("영화 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ 공용 정렬 함수 */
  const sortMovies = (list) => {
    const sorted = [...list];
    if (sortBy === "release_date") {
      sorted.sort((a, b) =>
        orderBy === "desc"
          ? new Date(b.release_date) - new Date(a.release_date)
          : new Date(a.release_date) - new Date(b.release_date)
      );
    } else if (sortBy === "vote_average") {
      sorted.sort((a, b) =>
        orderBy === "desc" ? b.rating - a.rating : a.rating - b.rating
      );
    } else {
      sorted.sort((a, b) =>
        orderBy === "desc" ? b.popularity - a.popularity : a.popularity - b.popularity
      );
    }
    return sorted;
  };

  /** ✅ 필터 변경 시 정렬만 수행 (검색 중일 때) */
  useEffect(() => {
    if (debouncedTerm && movies.length > 0) {
      setMovies((prev) => sortMovies(prev));
    }
  }, [sortBy, orderBy]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    loadMovies({ reset: true });
  }, [debouncedTerm, rating, selectedGenre]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadMovies({ reset: false });
        }
      });
    });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasMore, loading, debouncedTerm, rating, selectedGenre, sortBy, orderBy]);

  return (
    <div className={styles.home}>
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="제목 검색"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className={styles.searchInput}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestionList}>
              {suggestions.map((s) => (
                <li key={s.id} onClick={() => handleSuggestionClick(s.title || s.original_title)}>
                  <span className={styles.suggestionTitle}>{s.title || s.original_title}</span>
                  <span className={styles.suggestionYear}>
                    {s.release_date ? `(${s.release_date.split("-")[0]})` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className={styles.selectBox}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={`${sortBy}-${orderBy}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split("-");
            setSortBy(sort);
            setOrderBy(order);
          }}
          className={styles.selectBox}
        >
          <option value="release_date-desc">최신순</option>
          <option value="release_date-asc">오래된순</option>
          <option value="vote_average-desc">별점 높은순</option>
          <option value="vote_average-asc">별점 낮은순</option>
        </select>
      </div>

      <div className={styles.ratingFilter}>
        <button onClick={() => setRating(8)}>8점 이상</button>
        <button onClick={() => setRating(9)}>9점 이상</button>
      </div>

      <div className={styles.grid}>
        {movies.map((m) => (
          <Movie
            key={`${m.source}-${m.id}`}
            id={m.id}
            coverImg={m.coverImg}
            title={m.title}
            summary={m.summary}
            genres={m.genres}
            link={m.source === "yts" ? `/movie/${m.id}` : `/tmdb/${m.id}`}
            onGenreClick={handleGenreClick}
          />
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>영화 목록을 불러오는 중...</p>
        </div>
      )}

      {!loading && movies.length === 0 && (
        <p className={styles.noResult}>검색 결과가 없습니다.</p>
      )}

      {!hasMore && movies.length > 0 && (
        <p className={styles.noMore}>더 이상 결과 없음</p>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}

export default Home;
