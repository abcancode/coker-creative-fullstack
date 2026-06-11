import { useState } from "react";

import axios from "axios";

import { toast } from "sonner";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "https://coker-creative-fullstack.onrender.com/api/auth/forgot-password",
        {
          email,
        },
      );

      setSuccess(true);

      toast.success("Reset email sent");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={title}>Forgot Password</h1>

        <p style={subtitle}>
          Enter your admin email to receive a password reset link.
        </p>

        {success ? (
          <div
            style={{
              marginTop: "28px",
            }}
          >
            <p
              style={{
                color: "#16a34a",
                lineHeight: "1.7",
              }}
            >
              Password reset instructions have been sent to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="admin@cokercreative.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={input}
            />

            <button type="submit" disabled={loading} style={button}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
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
  padding: "0 18px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
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

export default ForgotPassword;
