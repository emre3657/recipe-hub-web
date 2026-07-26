import { NavLink, Outlet } from "react-router";
import useUserSession from "../../hooks/useUserSession";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const { users, currentUserId, isLoading, selectUser } = useUserSession();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Discover and cook</p>
          <div className={styles.title}>Recipe Hub</div>
        </div>
        <div className={styles.headerMeta}>
          <label className={styles.selectorLabel} htmlFor="user-selector">
            Active user
          </label>
          <select
            id="user-selector"
            className={styles.userSelect}
            value={currentUserId ?? ""}
            disabled={isLoading}
            onChange={(event) => selectUser(event.target.value || null)}
          >
            <option value="">Guest</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <aside className={styles.sidebar}>
        <nav aria-label="Primary navigation" className={styles.nav}>
          <p className={styles.sectionLabel}>Navigation</p>
          <ul className={styles.navList}>
            <li>
              <NavLink className={styles.navLink} to="/">
                Recipes
              </NavLink>
            </li>
            <li>
              <button className={styles.navButton} type="button" disabled>
                Favorites
              </button>
            </li>
            <li>
              <NavLink className={styles.navLink} to="/my-recipes">
                My Recipes
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
