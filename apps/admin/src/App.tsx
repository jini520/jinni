import { Routes, Route, Link, useLocation } from "react-router-dom";
import styles from "./app.module.scss";
import Home from "./home/Home";
import Skills from "./skills";
import Projects from "./projects/Projects";
import ProjectDetail from "./projects/ProjectDetail";
import Careers from "./careers/Careers";
import Certifications from "./certifications/Certifications";
import Educations from "./educations/Educations";
import Resumes from "./resumes/Resumes";
import Portfolios from "./portfolios/Portfolios";

const NAV_LINKS = [
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects", prefix: true },
  { to: "/careers", label: "Careers" },
  { to: "/certifications", label: "Certifications" },
  { to: "/educations", label: "Educations" },
  { to: "/resumes", label: "Resumes" },
  { to: "/portfolios", label: "Portfolios" },
];

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const isActive = (to: string, prefix?: boolean) =>
    prefix ? location.pathname.startsWith(to) : location.pathname === to;

  return (
    <div className={styles.app}>
      {!isHome && (
        <nav className={styles.nav}>
          <Link to="/" className={styles.brand}>
            Admin
          </Link>
          <div className={styles.links}>
            {NAV_LINKS.map(({ to, label, prefix }) => (
              <Link
                key={to}
                to={to}
                className={`${styles.link} ${
                  isActive(to, prefix) ? styles.active : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <main className={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/educations" element={<Educations />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/portfolios" element={<Portfolios />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
