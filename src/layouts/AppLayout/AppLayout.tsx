import { NavLink, Outlet } from "react-router";
import styles from "./AppLayout.module.css";

function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Recipe Hub</p>
          <h1 className={styles.title}>Recipe Hub</h1>
        </div>
      </header>

      <aside className={styles.sidebar}>
        <nav aria-label="Primary navigation" className={styles.nav}>
          <p className={styles.sectionLabel}>Navigation</p>
          <ul className={styles.navList}>
            <li>
              <NavLink className={styles.navLink} to="/">
                Dashboard
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>Footer</p>
      </footer>
    </div>
  );
}

export default AppLayout;
