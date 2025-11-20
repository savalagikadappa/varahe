import styles from './LoadingState.module.css';

export const LoadingState = ({ message = 'Fetching data…' }) => (
  <div className={styles.state} role="status" aria-live="polite">
    <span className={styles.spinner} aria-hidden="true" />
    <p>{message}</p>
  </div>
);
