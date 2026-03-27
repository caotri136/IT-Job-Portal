// Verify.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import styles from "./ForgotPassword.module.css";

export default function Verify(){
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("auth/forgot-password", {email});
            localStorage.setItem("forgot_email", email);
            setSuccessMessage(
                `Mã OTP đã được gửi tới ${email} nếu email tồn tại !`
            );
            navigate("/verify-otp", {state: {email}});
        } catch (err: any) {
            setError(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    return (
        <div className={styles.container}>
            {/* Left - hình nền */}
            <div className={styles.left}>
                <div className={styles.overlay}>
                </div>
            </div>

            {/* Right - Box verify */}
            <div className={styles.right}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Nhập email</h2>

                    {error && (
                        <div className={styles.errorBox}>
                            <span className={styles.errorIcon}>⚠️</span>
                            <span className={styles.errorText}>{error}</span>
                            <button
                                className={styles.errorClose}
                                onClick={() => setError("")}
                                aria-label="Đóng"
                            >
                                x
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleForgotPassword} className={styles.form}>
                        <input
                            type="text"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className={styles.input}
                            required
                        >
                        </input>

                        <button type="submit" 
                            className={styles.primaryButton}
                        >
                            Xác nhận
                        </button>

                        <div className={styles.registerRow}>
                            <button
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
