import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminLayout({ children, title, subtitle }) {
  const navigate = useNavigate();

  const location = useLocation();

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
      <Sidebar currentPath={location.pathname} />

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOPBAR */}
        <div
          style={{
            height: "90px",
            background: "#ffffff",
            borderBottom: "1px solid #ece7e2",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          {/* LEFT */}
          <div>
            <h1
              style={{
                margin: 0,
                color: "#401e37",
                fontSize: "30px",
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
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            {/* ADMIN INFO */}
            <div
              style={{
                textAlign: "right",
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
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div
          style={{
            padding: "40px",
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
