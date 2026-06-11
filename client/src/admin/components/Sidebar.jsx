import { useNavigate } from "react-router-dom";

function Sidebar({ currentPath, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      label: "Experiences",
      path: "/admin/experiences",
    },
    {
      label: "Settings",
      path: "/admin/settings",
    },
    {
      label: "Featured Brands",
      path: "/admin/featured-brands",
    },
    {
      label: "Testimonials",
      path: "/admin/testimonials",
    },
    {
      label: "Recognitions",
      path: "/admin/recognitions",
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 90,
          }}
        />
      )}

      <div
        style={{
          width: "280px",
          background: "#401e37",
          color: "#ffffff",
          padding: "32px 22px",
          display: "flex",
          flexDirection: "column",

          position: window.innerWidth <= 900 ? "fixed" : "sticky",
          top: 0,
          left: mobileOpen ? 0 : "-100%",
          height: "100vh",

          transition: "0.35s ease",

          zIndex: 100,

          flexShrink: 0,
        }}
      >
        {/* BRAND */}
        <div
          style={{
            marginBottom: "50px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontFamily: "'Bona Nova SC', serif",
            }}
          >
            Coker Creative
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#d6c8d2",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            Website Admin Dashboard.
          </p>
        </div>

        {/* NAVIGATION */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);

                  setMobileOpen(false);
                }}
                style={{
                  background: isActive ? "#ffffff" : "transparent",
                  color: isActive ? "#401e37" : "#ffffff",
                  border: "none",
                  padding: "16px 18px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "0.3s ease",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "30px",
            color: "#d6c8d2",
            fontSize: "13px",
            lineHeight: "1.8",
          }}
        >
          Coker Creative CMS
        </div>
      </div>
    </>
  );
}

export default Sidebar;
