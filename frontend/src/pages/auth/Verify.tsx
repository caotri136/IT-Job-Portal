// Verify.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import styles from "./Verify.module.css";

export default function Verify(){
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("pending_email");
        if (!savedEmail) {
            navigate("/register");
            return;
        }
        setEmail(savedEmail);
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("auth/verify", {email, otp});
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.removeItem("pending_emai");
            navigate("/profile");
        } catch (err: any) {
            const status = err.response?.status;
            const message = err.response?.data?.message;

            if (status === 404) {
                setError("Đã xảy ra lỗi, vui lòng đăng kí lại !");
            } else if (status === 400) {
                if (message === "Account already verified") setError("Tài khoản đã được xác minh !");
                else if (message === "No active OTP. Please request a new one") setError("Đã xảy ra lỗi, vui lòng đăng kí lại !");
                else if (message === "OTP expired. Please request a new one") setError("OTP đã hết hạn. Đăng kí lại !");
                else if (message === "Invalid OTP") setError("OTP không hợp lệ");
            }
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
                    <h2 className={styles.title}>Xác minh OTP</h2>

                    <p className={styles.emailHint}>
                        Mã OTP đã được gửi đến <strong>{email}</strong>
                    </p>

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

                    <form onSubmit={handleVerify} className={styles.form}>
                        <input
                            type="text"
                            placeholder=""
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.trim())}
                            className={styles.input}
                            required
                        >
                        </input>

                        <button type="submit" className={styles.primaryButton}>
                            Xác nhận
                        </button>

                        <div className={styles.registerRow}>
                            <button
                                className={styles.linkButton}
                                onClick={() => navigate("/register")}
                            >
                                Quay lại đăng kí
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
