import { useState } from "react";

import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `http://127.0.0.1:8000/api/auth/reset-password/${token}`,
        { password },
      );

      toast.success("Password reset successful");

      navigate("/admin/login");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={title}>Reset Password</h1>

        <p style={subtitle}>Enter your new admin password below.</p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              position: "relative",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={input}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} style={button}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const wrapper = {
  minHeight: "100vh",
  background: "#f4f1ef",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
};

const card = {
  width: "100%",
  maxWidth: "420px",
  background: "#ffffff",
  borderRadius: "28px",
  padding: "36px",
  boxShadow: "0 18px 45px rgba(0,0,0,0.06)",
};

const title = {
  marginTop: 0,
  color: "#401e37",
  fontSize: "38px",
  fontFamily: "'Bona Nova SC', serif",
};

const subtitle = {
  color: "#6b7280",
  lineHeight: "1.7",
  marginBottom: "28px",
};

const input = {
  width: "100%",
  height: "54px",
  borderRadius: "16px",
  border: "1px solid #ddd3cd",
  background: "#faf8f6",
  padding: "0 52px 0 18px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const eyeButton = {
  position: "absolute",
  top: "50%",
  right: "16px",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#6b7280",
};

const button = {
  width: "100%",
  height: "54px",
  border: "none",
  borderRadius: "16px",
  background: "#401e37",
  color: "#ffffff",
  marginTop: "18px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

export default ResetPassword;
