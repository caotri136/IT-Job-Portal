// ResetPassword.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import styles from "./Verify.module.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("reset_token");
    console.log("RESET TOKEN:", token);
    if (!token) {
      navigate("/forgot-password");
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải tối thiểu 6 ký tự");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const token = localStorage.getItem("reset_token");

      await api.post(
        "/auth/reset-password",
        { newPassword: password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Skip-Auth": "true",
          },
        }
      );

      // Thay alert + navigate bằng:
      setSuccess(true);
      localStorage.removeItem("reset_token");
      setTimeout(() => navigate("/login"), 2000); // tự chuyển sau 2 giây

    } catch (err: any) {
      setError(
        err.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn"
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Đặt lại mật khẩu</h2>

          {error && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>⚠️</span>
              <span className={styles.errorText}>{error}</span>
              <button
                className={styles.errorClose}
                onClick={() => setError("")}
              >
                x
              </button>
            </div>
          )}

          {success && (
            <div className={styles.successBox}>
                <span>✅</span>
                <span className={styles.successText}>Đổi mật khẩu thành công! Đang chuyển hướng...</span>
            </div>
          )}

          <form onSubmit={handleReset} className={styles.form}>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              className={styles.input}
              required
            />

            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.trim())}
              className={styles.input}
              required
            />

            <button type="submit" className={styles.primaryButton}>
              Xác nhận
            </button>

            <div className={styles.registerRow}>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => navigate("/login")}
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
