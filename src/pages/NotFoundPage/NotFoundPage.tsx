import { Link } from "react-router";
import styles from "./NotFoundPage.module.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function NotFoundPage() {
  useDocumentTitle("Page Not Found");

  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <h1 id="not-found-title" className={styles.title}>
        Page not found
      </h1>
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
