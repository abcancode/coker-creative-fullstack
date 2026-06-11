import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/admin/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginAdmin(formData);

      localStorage.setItem("token", data.token);

      localStorage.setItem("admin", JSON.stringify(data.admin));

      // AUTH CONTEXT LOGIN
      login(data.admin, data.token);

      // REDIRECT
      navigate("/admin/dashboard");
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message || error.message || "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f1ef",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "28px",
          padding: "34px 34px 24px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.06)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Bona Nova SC', serif",
              fontSize: "52px",
              lineHeight: "0.9",
              color: "#401e37",
              margin: 0,
              fontWeight: "400",
            }}
          >
            Coker
            <br />
            Creative
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginTop: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "1px",
                background: "#ddd3cd",
              }}
            />

            <span
              style={{
                color: "#401e37",
                fontSize: "11px",
              }}
            >
              ✦
            </span>

            <div
              style={{
                width: "64px",
                height: "1px",
                background: "#ddd3cd",
              }}
            />
          </div>

          <p
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "7px",
              color: "#6b7280",
              textTransform: "uppercase",
              fontSize: "12px",
              margin: 0,
            }}
          >
            Admin Portal
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "9px",
                color: "#401e37",
                fontWeight: "600",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="admin@cokercreative.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "16px",
                border: "1px solid #ddd3cd",
                background: "#faf8f6",
                padding: "0 20px",
                fontSize: "15px",
                fontFamily: "Inter, sans-serif",
                outline: "none",
                boxSizing: "border-box",
                color: "#401e37",
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "9px",
                color: "#401e37",
                fontWeight: "600",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "16px",
                  border: "1px solid #ddd3cd",
                  background: "#faf8f6",
                  padding: "0 52px 0 20px",
                  fontSize: "15px",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                  color: "#401e37",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "16px",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* <div
            style={{
              textAlign: "right",
              marginTop: "-10px",
              marginBottom: "22px",
            }}
          >
            <a
              href="/admin/forgot-password"
              style={{
                color: "#401e37",
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Forgot Password?
            </a>
          </div> */}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "54px",
              border: "none",
              borderRadius: "16px",
              background: "#401e37",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: "600",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
            color: "#9ca3af",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Coker Creative Admin Portal
        </div>
      </div>
    </div>
  );
}

export default Login;
