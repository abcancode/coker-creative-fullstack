import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import AdminLayout from "../layouts/AdminLayout";

import {
  getRecognitions,
  createRecognition,
  deleteRecognition,
} from "../../services/recognitionService";

import { uploadExperienceImage } from "../../services/experienceService";

// IMAGE HELPER
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

function Recognitions() {
  const [recognitions, setRecognitions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  });

  // FETCH
  useEffect(() => {
    fetchRecognitions();
  }, []);

  const fetchRecognitions = async () => {
    try {
      const data = await getRecognitions();

      setRecognitions(data);
    } catch (error) {
      console.log(error);
    }
  };

  // CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // UPLOAD
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const imageData = new FormData();

      imageData.append("image", file);

      const data = await uploadExperienceImage(imageData);

      setFormData((prev) => ({
        ...prev,
        logo: data.imageUrl,
      }));

      toast.success("Logo uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createRecognition(formData);

      toast.success("Recognition added");

      setFormData({
        name: "",
        logo: "",
      });

      fetchRecognitions();
    } catch (error) {
      console.log(error);

      toast.error("Failed to add recognition");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteRecognition(id);

      toast.success("Recognition deleted");

      fetchRecognitions();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Recognitions"
      subtitle="Manage awards and recognitions."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "28px",
        }}
      >
        {/* FORM */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Add Recognition</h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Recognition Name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <input type="file" accept="image/*" onChange={handleUpload} />

              {formData.logo && (
                <img
                  src={getImageUrl(formData.logo)}
                  alt="Preview"
                  style={{
                    width: "180px",
                    height: "100px",
                    objectFit: "contain",
                    background: "#f8f8f8",
                    padding: "16px",
                    borderRadius: "14px",
                  }}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              style={buttonStyle}
            >
              {loading ? "Saving..." : "Add Recognition"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Existing Recognitions</h2>

          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {recognitions.map((recognition) => (
              <div
                key={recognition._id}
                style={{
                  border: "1px solid #ece7e2",
                  borderRadius: "18px",
                  padding: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <img
                    src={getImageUrl(recognition.logo)}
                    alt={recognition.name}
                    style={{
                      width: "100px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />

                  <h3
                    style={{
                      margin: 0,
                      color: "#401e37",
                    }}
                  >
                    {recognition.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleDelete(recognition._id)}
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const cardStyle = {
  background: "#ffffff",
  borderRadius: "28px",
  padding: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
};

const titleStyle = {
  marginTop: 0,
  color: "#401e37",
  fontFamily: "'Bona Nova SC', serif",
};

const inputStyle = {
  height: "54px",
  borderRadius: "14px",
  border: "1px solid #ddd3cd",
  background: "#faf8f6",
  padding: "0 18px",
  fontSize: "15px",
  outline: "none",
};

const buttonStyle = {
  marginTop: "24px",
  background: "#401e37",
  color: "#ffffff",
  border: "none",
  padding: "14px 24px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Recognitions;
