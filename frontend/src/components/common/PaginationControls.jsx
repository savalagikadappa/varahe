import styles from './PaginationControls.module.css';

export const PaginationControls = ({ page, totalPages, onPageChange }) => (
  <div className={styles.wrapper}>
    <button
      type="button"
      className={styles.button}
      onClick={() => onPageChange(Math.max(page - 1, 1))}
      disabled={page <= 1}
    >
      Prev
    </button>
    <span>
      Page {page} / {totalPages}
    </span>
    <button
      type="button"
      className={styles.button}
      onClick={() => onPageChange(Math.min(page + 1, totalPages))}
      disabled={page >= totalPages}
    >
      Next
    </button>
  </div>
);
