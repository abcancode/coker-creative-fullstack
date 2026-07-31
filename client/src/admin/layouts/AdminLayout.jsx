import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";

function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();

  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let admin = null;

  try {
    admin = JSON.parse(localStorage.getItem("admin"));
  } catch (error) {
    console.log(error);
  }

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f2ef",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar
        currentPath={location.pathname}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* TOPBAR */}
        <div
          style={{
            minHeight: "90px",
            background: "#ffffff",
            borderBottom: "1px solid #ece7e2",
            padding: isMobile ? "20px" : "0 40px",

            display: "flex",

            flexDirection: isMobile ? "column" : "row",

            alignItems: isMobile ? "flex-start" : "center",

            justifyContent: "space-between",

            gap: isMobile ? "20px" : "0",

            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "center",
              gap: "18px",
              width: "100%",
            }}
          >
            {/* MOBILE MENU */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(true)}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  border: "none",
                  background: "#401e37",
                  color: "#ffffff",
                  fontSize: "22px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ☰
              </button>
            )}

            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#401e37",
                  fontSize: isMobile ? "24px" : "30px",
                  fontFamily: "'Bona Nova SC', serif",
                }}
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#6b7280",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",

              width: isMobile ? "100%" : "auto",

              justifyContent: isMobile ? "space-between" : "flex-end",

              gap: "16px",

              flexWrap: "wrap",
            }}
          >
            {/* ADMIN INFO */}
            <div
              style={{
                textAlign: isMobile ? "left" : "right",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#401e37",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {admin?.name || "Admin"}
              </p>

              <span
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                {admin?.email || ""}
              </span>
            </div>

            {/* AVATAR */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#401e37",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "16px",
                flexShrink: 0,
              }}
            >
              {admin?.name?.charAt(0) || "A"}
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              style={{
                background: "#ef4444",
                color: "#ffffff",
                border: "none",
                padding: "12px 18px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div
          style={{
            padding: isMobile ? "20px" : "40px",
            flex: 1,
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
