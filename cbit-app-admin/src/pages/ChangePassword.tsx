import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../api/client";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Şifre değiştirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">
          <img src="/image102.jpg" alt="CBIT Logo" />
        </div>
        <h1 className="login-title">Şifre Değiştir</h1>
        <p className="login-subtitle">
          Admin hesabınızın şifresini güncelleyin
        </p>

        {error && <div className="admin-msg error">{error}</div>}
        {success && (
          <div className="admin-msg success">
            Şifreniz başarıyla güncellendi.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="form-label">Mevcut Şifre</label>
            <div className="password-input-wrap">
              <input
                className="form-control"
                type={showCurrent ? "text" : "password"}
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
                required
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrent(!showCurrent)}
                tabIndex={-1}
              >
                {showCurrent ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label className="form-label">Yeni Şifre</label>
            <div className="password-input-wrap">
              <input
                className="form-control"
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNew(!showNew)}
                tabIndex={-1}
              >
                {showNew ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label className="form-label">Yeni Şifre (Tekrar)</label>
            <input
              className="form-control"
              type={showNew ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
          <button
            type="button"
            className="btn btn-secondary login-btn"
            style={{ marginTop: "8px" }}
            onClick={() => navigate("/")}
          >
            Geri Dön
          </button>
        </form>
      </div>
    </div>
  );
}
