import { useEffect, useState } from "react";
import { getExperiences } from "../../services/experienceService";
import AdminLayout from "../layouts/AdminLayout";

function Dashboard() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getExperiences();

      setExperiences(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back to Coker Creative CMS."
    >
      {/* MAIN CONTENT */}
      <div>
        {/* OVERVIEW CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            marginBottom: "38px",
          }}
        >
          {[
            {
              title: "Experiences",
              value: experiences.length,
              text: "Luxury experiences currently published",
            },
            {
              title: "Gallery Images",
              value: experiences.reduce(
                (total, exp) => total + (exp.gallery?.length || 0),
                0,
              ),
              text: "Uploaded gallery images",
            },
            {
              title: "Hero Images",
              value: experiences.reduce(
                (total, exp) => total + (exp.heroImages?.length || 0),
                0,
              ),
              text: "Luxury hero banners uploaded",
            },
          ].map((card, index) => (
            <div
              key={index}
              style={{
                background: "#ffffff",
                borderRadius: "26px",
                padding: "28px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                {card.title}
              </p>

              <h2
                style={{
                  margin: "14px 0",
                  fontSize: "42px",
                  color: "#401e37",
                  fontFamily: "'Bona Nova SC', serif",
                }}
              >
                {card.value}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  lineHeight: "1.7",
                  fontSize: "14px",
                }}
              >
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* MAIN SECTION */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "30px",
            padding: "34px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontFamily: "'Bona Nova SC', serif",
              fontSize: "34px",
              color: "#401e37",
            }}
          >
            Dashboard Overview
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "1.8",
              maxWidth: "760px",
            }}
          >
            Your luxury experience CMS is now fully connected and operational.
            You can now manage experiences, and website content dynamically from
            this admin portal.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

const actionButton = {
  background: "#401e37",
  color: "#ffffff",
  border: "none",
  padding: "14px 22px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const secondaryActionButton = {
  background: "#ffffff",
  color: "#401e37",
  border: "1px solid #ddd3cd",
  padding: "14px 22px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

export default Dashboard;
