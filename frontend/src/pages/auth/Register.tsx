// Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import styles from "./Register.module.css";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            const res = await api.post("/auth/register", { email, name, password, birthDay});
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("pending_email",email);
            navigate("/verify");
        } catch (err: any) {
            const status = err.response?.status;
            const message = err.response?.data?.message;

            if (status === 406) {
                setError("Email này đã được đăng ký. Vui lòng dùng email khác !");
            } else if (message) {
                setError(message);
            } else {
                setError("Đăng kí thất bại. Vui lòng thử lại");
            }
        }
    };

    return(
        <div className={styles.container}>
            {/* LEFT — Hình nền */}
            <div className={styles.left}>
                <div className={styles.overlay}>
                </div>
            </div>

            {/* Right - Box register */}
            <div className={styles.right}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Đăng ký</h2>

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

                    <form onSubmit={handleRegister} className={styles.form}>
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className={styles.input}
                            required
                            autoComplete="email"
                        />
                        <input
                            type="text"
                            placeholder="Tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            required
                            autoComplete="name"
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.trim())}
                            className={styles.input}
                            required
                            autoComplete="new-password"
                        />
                        <input
                            type="date"
                            placeholder="Ngày sinh"
                            value={birthDay}
                            onChange={(e) => setBirthDay(e.target.value.trim())}
                            className={styles.input}
                            required
                            autoComplete="bday"
                        />
                        
                        <button type="submit" className={styles.primaryButton}>
                            Đăng ký
                        </button>

                        <div className={styles.loginRow}>
                            <span>Đã có tài khoản ?</span>
                            <button
                                className={styles.linkButton}
                                onClick={() => navigate("/login")}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
