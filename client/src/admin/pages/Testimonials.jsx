import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import AdminLayout from "../layouts/AdminLayout";

import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
} from "../../services/testimonialService";

import { uploadExperienceImage } from "../../services/experienceService";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    image: "",
  });

  // FETCH TESTIMONIALS
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();

      setTestimonials(data);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // IMAGE UPLOAD
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
        image: data.imageUrl,
      }));

      toast.success("Image uploaded");
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

      await createTestimonial(formData);

      toast.success("Testimonial added");

      setFormData({
        name: "",
        role: "",
        quote: "",
        image: "",
      });

      fetchTestimonials();
    } catch (error) {
      console.log(error);

      toast.error("Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id);

      toast.success("Testimonial deleted");

      fetchTestimonials();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout title="Testimonials" subtitle="Manage homepage testimonials.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "28px",
        }}
      >
        {/* FORM */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Add Testimonial</h2>

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
                placeholder="Client Name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <input
                type="text"
                name="role"
                placeholder="Client Role / Company"
                value={formData.role}
                onChange={handleChange}
                style={inputStyle}
              />

              <textarea
                name="quote"
                placeholder="Testimonial Quote"
                value={formData.quote}
                onChange={handleChange}
                rows="6"
                style={{
                  ...inputStyle,
                  height: "180px",
                  padding: "18px",
                  resize: "vertical",
                }}
                required
              />

              <input type="file" accept="image/*" onChange={handleUpload} />

              {formData.image && (
                <img
                  src={getImageUrl(formData.image)}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              style={buttonStyle}
            >
              {loading ? "Saving..." : "Add Testimonial"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Existing Testimonials</h2>

          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                style={{
                  border: "1px solid #ece7e2",
                  borderRadius: "18px",
                  padding: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  {testimonial.image && (
                    <img
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        color: "#401e37",
                      }}
                    >
                      {testimonial.name}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: "#9ca3af",
                        fontSize: "14px",
                      }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    marginTop: "16px",
                    lineHeight: "1.8",
                    color: "#555",
                  }}
                >
                  "{testimonial.quote}"
                </p>

                <button
                  onClick={() => handleDelete(testimonial._id)}
                  style={{
                    marginTop: "14px",
                    background: "#ef4444",
                    color: "#fff",
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
  width: "100%",
  border: "1px solid #ddd3cd",
  borderRadius: "14px",
  background: "#faf8f6",
  padding: "0 18px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  height: "54px",
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

export default Testimonials;
