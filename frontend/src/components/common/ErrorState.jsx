import styles from './ErrorState.module.css';

export const ErrorState = ({ message = 'Unable to fetch data', onRetry }) => (
  <div className={styles.state} role="alert">
    <p>{message}</p>
    {onRetry && (
      <button type="button" className={styles.retry} onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);
