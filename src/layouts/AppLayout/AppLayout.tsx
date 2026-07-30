import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import useUserSession from "../../hooks/useUserSession";
import FocusTrap from "../../components/FocusTrap/FocusTrap";
import recipeHubLogo from "../../assets/recipe-hub-logo.svg";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const location = useLocation();

  const { users, currentUserId, isLoading, selectUser } = useUserSession();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  const closeNavigation = () => {
    setIsNavigationOpen(false);
  };

  useEffect(() => {
    if (!isNavigationOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavigationOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNavigationOpen]);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brandBlock}>
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Open navigation"
            aria-controls="primary-sidebar"
            aria-expanded={isNavigationOpen}
            onClick={() => setIsNavigationOpen(true)}
          >
            <span aria-hidden="true">☰</span>
          </button>

          <NavLink
            className={styles.brandLink}
            to="/"
            aria-label="Recipe Hub home"
            onClick={closeNavigation}
          >
            <img
              className={styles.brandMark}
              src={recipeHubLogo}
              alt="Recipe Hub Logo"
              aria-hidden="true"
            />

            <span className={styles.brandText}>
              <span className={styles.eyebrow}>Discover and cook</span>
              <span className={styles.title}>Recipe Hub</span>
            </span>
          </NavLink>
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

      {isNavigationOpen ? (
        <button
          className={styles.backdrop}
          type="button"
          aria-label="Close navigation"
          onClick={closeNavigation}
        />
      ) : null}

      <aside
        id="primary-sidebar"
        className={[
          styles.sidebar,
          isNavigationOpen ? styles.sidebarOpen : "",
        ].join(" ")}
        aria-label="Primary navigation"
      >
        <FocusTrap active={isNavigationOpen}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>Navigation</span>

            <button
              className={styles.closeButton}
              type="button"
              aria-label="Close navigation"
              onClick={closeNavigation}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className={styles.nav}>
            <p className={styles.sectionLabel}>Navigation</p>

            <ul className={styles.navList}>
              <li>
                <NavLink
                  className={styles.navLink}
                  to="/"
                  onClick={closeNavigation}
                >
                  Recipes
                </NavLink>
              </li>

              <li>
                <NavLink
                  className={styles.navLink}
                  to="/favorites"
                  onClick={closeNavigation}
                >
                  Favorites
                </NavLink>
              </li>

              <li>
                <NavLink
                  className={styles.navLink}
                  to="/my-recipes"
                  onClick={closeNavigation}
                >
                  My Recipes
                </NavLink>
              </li>
            </ul>
          </nav>
        </FocusTrap>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Recipe Hub ❤️ Built with React, TypeScript and IndexedDB.</p>
        <p></p>
      </footer>
    </div>
  );
}

export default AppLayout;
