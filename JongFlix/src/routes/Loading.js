import React from "react";
import styles from "./Detail.module.css";

function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>영화 정보를 불러오는 중...</p>
    </div>
  );
}

export default Loading;

