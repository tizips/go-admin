import styles from './index.less';

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.warp}>
        <div className={`${styles.spin} ${styles.spinLg} ${styles.spinning}`}>
          <span className={`${styles.spinDot} ${styles.dotSpin}`}>
            <i className={styles.dotItem} />
            <i className={styles.dotItem} />
            <i className={styles.dotItem} />
            <i className={styles.dotItem} />
          </span>
        </div>
      </div>
      <div className={styles.title}>余白</div>
    </div>
  );
};

export default Loading;
