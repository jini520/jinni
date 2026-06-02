import { Link } from "react-router-dom";
import styles from "./home.module.scss";

const MENU = [
  { to: "/skills", icon: "🛠️", title: "Skills", desc: "기술 스택 관리" },
  { to: "/projects", icon: "📁", title: "Projects", desc: "프로젝트 관리" },
  { to: "/careers", icon: "💼", title: "Careers", desc: "경력 정보 관리" },
  { to: "/certifications", icon: "🏆", title: "Certifications", desc: "자격증 및 수상 관리" },
  { to: "/educations", icon: "🎓", title: "Educations", desc: "교육 이력 관리" },
  { to: "/resumes", icon: "📄", title: "Resumes", desc: "이력서 파일 관리" },
  { to: "/portfolios", icon: "🗂️", title: "Portfolios", desc: "포트폴리오 파일 관리" },
];

const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>관리할 항목을 선택하세요</p>
      </header>

      <div className={styles.grid}>
        {MENU.map(({ to, icon, title, desc }) => (
          <Link key={to} to={to} className={styles.card}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.cardTitle}>{title}</span>
            <span className={styles.cardDesc}>{desc}</span>
            <span className={styles.arrow}>→</span>
          </Link>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>jinni Admin Panel</p>
      </footer>
    </div>
  );
};

export default Home;
