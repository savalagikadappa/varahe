import clsx from 'clsx';
import styles from './Card.module.css';

export const Card = ({ title, subtitle, actions, children, className }) => (
  <section className={clsx(styles.card, className)}>
    {(title || actions) && (
      <header className={styles.header}>
        <div>
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
    )}
    <div className={styles.content}>{children}</div>
  </section>
);
