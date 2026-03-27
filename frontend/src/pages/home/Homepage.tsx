// Homepage.tsx
import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";

const stats = [
  { value: "12,400+", label: "Việc làm đang tuyển" },
  { value: "3,200+", label: "Công ty uy tín" },
  { value: "98,000+", label: "Ứng viên đã tìm được việc" },
];

const tags = [
  "Backend Developer", "Frontend Developer", "UI/UX Designer",
  "Data Engineer", "DevOps", "Product Manager",
  "Mobile Developer", "AI / ML Engineer",
];

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <span className={styles.logo}>
          <span className={styles.logoDot} />
          JobPortal
        </span>
        <button className={styles.navLogin} onClick={() => navigate("/login")}>
          Đăng nhập
        </button>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Background blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Nền tảng tuyển dụng hàng đầu Việt Nam
          </div>

          <h1 className={styles.heroTitle}>
            Tìm công việc<br />
            <em>mơ ước</em> của bạn
          </h1>

          <p className={styles.heroSub}>
            Kết nối hàng nghìn ứng viên tài năng với các công ty
            công nghệ hàng đầu. Cơ hội đang chờ bạn.
          </p>

          <div className={styles.heroCta}>
            <button
              className={styles.ctaPrimary}
              onClick={() => navigate("/login")}
            >
              Bắt đầu ngay →
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => navigate("/register")}
            >
              Tạo tài khoản miễn phí
            </button>
          </div>

          {/* Tags */}
          <div className={styles.tagRow}>
            <span className={styles.tagLabel}>Phổ biến:</span>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Floating card decoration */}
        <div className={styles.floatCard}>
          <div className={styles.floatCardHeader}>
            <div className={styles.floatAvatar}>N</div>
            <div>
              <div className={styles.floatName}>Nguyễn Văn A</div>
              <div className={styles.floatRole}>Senior Backend Dev</div>
            </div>
            <span className={styles.floatBadge}>✓ Hired</span>
          </div>
          <div className={styles.floatCompany}>@ VNG Corporation</div>
        </div>

        <div className={styles.floatCard2}>
          <div className={styles.floatIcon}>🚀</div>
          <div>
            <div className={styles.floatStat}>128</div>
            <div className={styles.floatStatLabel}>Offer mới hôm nay</div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section className={styles.statsSection}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

    </div>
  );
}
