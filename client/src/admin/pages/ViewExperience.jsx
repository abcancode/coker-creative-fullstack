import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "sonner";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) {
    return "https://placehold.co/1200x700/f5f2ef/401e37?text=Coker+Creative";
  }

  // IF IMAGE IS ALREADY A FULL URL
  if (image.startsWith("http")) {
    return image;
  }

  // CLOUDINARY PUBLIC ID
  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

function ViewExperience() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [experience, setExperience] = useState(null);

  // FETCH EXPERIENCE
  const fetchExperience = async () => {
    try {
      const { data } = await axios.get(
        `https://coker-creative-fullstack.onrender.com/api/experiences/${id}`,
      );

      setExperience(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  // DELETE EXPERIENCE
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this experience?");

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://coker-creative-fullstack.onrender.com/api/experiences/${experience._id}`,
      );

      navigate("/admin/experiences");
    } catch (error) {
      console.log(error);
    }
  };

  if (!experience) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout
      title="View Experience"
      subtitle="Preview and manage experience content."
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate("/admin/experiences")}
          style={secondaryButton}
        >
          ← Back
        </button>

        <div
          style={{
            display: "flex",
            gap: "14px",
          }}
        >
          <button
            onClick={() =>
              navigate(`/admin/experiences/edit/${experience._id}`)
            }
            style={primaryButton}
          >
            Edit Experience
          </button>

          <button onClick={handleDelete} style={deleteButton}>
            Delete
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "30px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        {/* HERO IMAGE */}
        <div
          style={{
            height: "420px",
            background: "#ddd",
            position: "relative",
          }}
        >
          <img
            src={
              experience.heroImages?.[0]
                ? experience.heroImages[0].startsWith("http")
                  ? experience.heroImages[0]
                  : `https://res.cloudinary.com/djp4j1mvn/image/upload/${experience.heroImages[0]}`
                : "https://placehold.co/1200x700/f5f2ef/401e37?text=Coker+Creative"
            }
            alt={experience.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* CONTENT */}
        <div
          style={{
            padding: "40px",
          }}
        >
          {/* CATEGORY */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                background: "#401e37",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {experience.category}
            </span>
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontFamily: "'Bona Nova SC', serif",
              fontSize: "58px",
              lineHeight: "1",
              color: "#401e37",
              marginBottom: "22px",
            }}
          >
            {experience.title}
          </h1>

          {/* SHORT DESCRIPTION */}
          {experience.shortDescription && (
            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
                lineHeight: "1.8",
                maxWidth: "850px",
                marginBottom: "30px",
              }}
            >
              {experience.shortDescription}
            </p>
          )}

          {/* FULL DESCRIPTION */}
          {experience.fullDescription && (
            <div
              style={{
                marginBottom: "40px",
              }}
            >
              <h3
                style={{
                  color: "#401e37",
                  marginBottom: "16px",
                  fontSize: "22px",
                }}
              >
                Experience Details
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  lineHeight: "2",
                  fontSize: "16px",
                  whiteSpace: "pre-line",
                }}
              >
                {experience.fullDescription}
              </p>
            </div>
          )}

          {/* GALLERY */}
          {experience.gallery?.length > 0 && (
            <div>
              <h3
                style={{
                  color: "#401e37",
                  marginBottom: "20px",
                  fontSize: "22px",
                }}
              >
                Gallery
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "18px",
                }}
              >
                {experience.gallery.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      borderRadius: "22px",
                      overflow: "hidden",
                      height: "220px",
                      background: "#ddd",
                    }}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Gallery ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO */}
          <div
            style={{
              marginTop: "50px",
              paddingTop: "30px",
              borderTop: "1px solid #ece7e2",
            }}
          >
            <h3
              style={{
                color: "#401e37",
                marginBottom: "18px",
                fontSize: "22px",
              }}
            >
              SEO Metadata
            </h3>

            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {/* <div>
                <strong>SEO Title:</strong>

                <p style={seoText}>{experience.seoTitle || "Not set"}</p>
              </div>

              <div>
                <strong>SEO Description:</strong>

                <p style={seoText}>{experience.seoDescription || "Not set"}</p>
              </div> */}

              <div>
                <strong>Slug:</strong>

                <p style={seoText}>/experiences/{experience.slug}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// BUTTONS
const primaryButton = {
  background: "#401e37",
  color: "#ffffff",
  border: "none",
  padding: "14px 20px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontFamily: "Inter, sans-serif",
};

const secondaryButton = {
  background: "#ffffff",
  color: "#401e37",
  border: "1px solid #ddd3cd",
  padding: "14px 20px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontFamily: "Inter, sans-serif",
};

const deleteButton = {
  background: "#ef4444",
  color: "#ffffff",
  border: "none",
  padding: "14px 20px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontFamily: "Inter, sans-serif",
};

const seoText = {
  margin: "6px 0 0",
  color: "#6b7280",
  lineHeight: "1.8",
};

export default ViewExperience;
