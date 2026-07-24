import styles from "./DashboardPage.module.css";

function DashboardPage() {
  return (
    <section className={styles.page} aria-labelledby="dashboard-title">
      <h2 id="dashboard-title" className={styles.title}>
        Recipes
      </h2>
      <p className={styles.description}>
        Recipes will appear here soon as the app foundation is completed.
      </p>
    </section>
  );
}

export default DashboardPage;
