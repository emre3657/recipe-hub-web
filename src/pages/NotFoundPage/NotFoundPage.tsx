import { Link } from "react-router";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <h2 id="not-found-title" className={styles.title}>
        Page not found
      </h2>
      <p className={styles.description}>
        The page you requested could not be found.
      </p>
      <Link className={styles.link} to="/">
        Go back home
      </Link>
    </section>
  );
}

export default NotFoundPage;
