import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice";

function AdminLogin({ onLoginSuccess }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage("Invalid administrator email or password. Please verify your credentials.");
        } else if (response.status === 502 || response.status === 504) {
          setErrorMessage(
            "Backend server is offline. Please start the backend server in a separate terminal: cd backend && npm start"
          );
        } else {
          setErrorMessage(
            data.message || `Server error (${response.status}). Please verify that the backend is running.`
          );
        }
        setLoading(false);
        return;
      }

      // Check role authorization on the client
      if (!data.user || data.user.role !== "admin") {
        setErrorMessage(
          "Access Denied: This account does not have administrator privileges. Only authorized administrators can access this panel."
        );
        setLoading(false);
        return;
      }

      // Store in Redux (and sessionStorage)
      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        window.history.pushState(null, "", "/admin");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    } catch (err) {
      console.error("Login connection error:", err);
      setErrorMessage(
        "Cannot reach backend API at http://localhost:5000. Please start the backend server by running 'cd backend && npm start' in your terminal."
      );
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #fffaf6 0%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "0 12px 36px rgba(34, 34, 34, 0.08)",
          padding: "36px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              margin: "0 auto 14px",
              borderRadius: "12px",
              background: "var(--accent)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(255, 106, 0, 0.3)",
            }}
          >
            🔒
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text-h)",
              margin: "0 0 6px",
            }}
          >
            Admin Sign In
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text)", margin: 0 }}>
            Restricted area. Authorized store administrators only.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              background: "#fee4e2",
              border: "1px solid #fecdca",
              color: "#b42318",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "20px",
              lineHeight: 1.4,
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <label style={{ display: "grid", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--text-h)" }}>
            Admin Email Address
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@scootstore.com"
              autoComplete="username"
              style={{
                width: "100%",
                padding: "11px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "14px",
                color: "var(--text-h)",
                background: "#ffffff",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--text-h)" }}>
            Admin Password
            <div style={{ position: "relative" }}>
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "11px 40px 11px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                  color: "var(--text-h)",
                  background: "#ffffff",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "var(--text)",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <button
            className="button button-primary"
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 700,
              marginTop: "8px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Verifying Credentials..." : "Sign In to Admin Dashboard"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <a
            href="/"
            style={{
              color: "var(--text)",
              fontSize: "13px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Return to ScootStore Customer Shop
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
