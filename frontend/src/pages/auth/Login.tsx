// Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/profile");
    } catch (err: any) {
      alert(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className={styles.container}>

      {/* LEFT — Hình nền */}
      <div className={styles.left}>
        <div className={styles.overlay}>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Đăng nhập</h2>

          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className={styles.input}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="current-password"
            />
            <button type="submit" className={styles.primaryButton}>
              Đăng nhập
            </button>
          </form>

          <div className={styles.extraActions}>
            <div>
              <button
                className={styles.linkButton}
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className={styles.registerRow}>
              <span>Chưa có tài khoản?</span>
              <button
                className={styles.linkButton}
                onClick={() => navigate("/register")}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
