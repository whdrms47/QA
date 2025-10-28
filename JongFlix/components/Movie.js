import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";

function Movie({ id, coverImg, title, summary, genres, link, onGenreClick }) {
  const handleImageError = (e) => {
    const fallback = "https://res.cloudinary.com/dy1xcx7kw/image/upload/v1729430065/no-poster-dark_jongflix.jpg";
    if (e.target.src !== fallback) {
      e.target.src = fallback;
    } else {
      e.target.onerror = null; // ✅ 무한 루프 방지
    }
  };

  return (
    <div className={styles.card}>
      <Link to={link}>
        <img
          src={coverImg}
          alt={title}
          className={styles.cover}
          onError={handleImageError}
        />
      </Link>
      <h2>{title}</h2>
      <p>{summary.length > 120 ? `${summary.slice(0, 120)}...` : summary}</p>
      <ul className={styles.genres}>
        {genres.map((g) => (
          <li
            key={g}
            className={styles.genre}
            onClick={() => onGenreClick && onGenreClick(g)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              onGenreClick &&
              onGenreClick(g)
            }
            title={`${g} 장르로 필터링`}
          >
            {g}
          </li>
        ))}
      </ul>
    </div>
  );
}

Movie.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  link: PropTypes.string.isRequired,
  onGenreClick: PropTypes.func,
};

export default Movie;
