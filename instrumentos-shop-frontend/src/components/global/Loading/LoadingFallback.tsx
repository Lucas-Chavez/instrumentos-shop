import styles from './loadingFallback.module.css';

const LoadingFallback = () => (
    <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>Cargando...</span>
    </div>
);

export default LoadingFallback;