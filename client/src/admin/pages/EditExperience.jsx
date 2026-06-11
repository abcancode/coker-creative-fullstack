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

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

function EditExperience() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    fullDescription: "",
    heroImages: [],
    gallery: [],
    featuredVideo: "",
  });

  // FETCH EXPERIENCE
  const fetchExperience = async () => {
    try {
      const { data } = await axios.get(
        `https://coker-creative-fullstack.onrender.com/api/experiences/${id}`,
      );

      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        category: data.category || "",
        fullDescription: data.fullDescription || "",
        heroImages: data.heroImages || [],
        gallery: data.gallery || [],
        featuredVideo: data.featuredVideo || "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // HANDLE HERO IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      setUploading(true);

      const uploadedImages = [];

      for (const file of files) {
        const imageData = new FormData();

        imageData.append("image", file);

        const { data } = await axios.post(
          "https://coker-creative-fullstack.onrender.com/api/experiences/upload",
          imageData,
        );

        uploadedImages.push(data.imageUrl);
      }

      setFormData((prev) => ({
        ...prev,
        heroImages: [...prev.heroImages, ...uploadedImages],
      }));

      toast.success("Hero images uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const imageData = new FormData();

      imageData.append("image", file);

      const { data } = await axios.post(
        "https://coker-creative-fullstack.onrender.com/api/experiences/upload",
        imageData,
      );

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, data.imageUrl],
      }));
    } catch (error) {
      console.log(error);

      toast.error("Gallery upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove),
    }));
  };

  // UPDATE EXPERIENCE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://coker-creative-fullstack.onrender.com/api/experiences/${id}`,
        formData,
      );

      toast.success("Experience updated successfully");

      navigate(`/admin/experiences/${id}`);
    } catch (error) {
      console.log(error);

      toast.error("Failed to update experience");
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  return (
    <AdminLayout
      title="Edit Experience"
      subtitle="Update experience information and media."
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <button onClick={() => navigate(-1)} style={secondaryButton}>
          ← Back
        </button>
      </div>

      {/* FORM */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "28px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* TOP GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            <input
              type="text"
              name="title"
              placeholder="Experience Title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="text"
              name="slug"
              placeholder="Slug"
              value={formData.slug}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Category</option>

              <option value="Wedding Experience">Wedding Experience</option>

              <option value="Social Experience">Social Experience</option>

              <option value="Corporate Experience">Corporate Experience</option>
            </select>

            {/* HERO IMAGE */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#401e37",
                  fontWeight: "600",
                }}
              >
                Hero Images
              </label>

              <label
                style={{
                  border: "1px dashed #d8cfc8",
                  borderRadius: "20px",
                  background: "#faf8f6",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  minHeight: "220px",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />

                {formData.heroImages.length > 0 ? (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "12px",
                        width: "100%",
                      }}
                    >
                      {formData.heroImages.map((image, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                          }}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "14px",
                            }}
                          />

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();

                              setFormData((prev) => ({
                                ...prev,
                                heroImages: prev.heroImages.filter(
                                  (_, i) => i !== index,
                                ),
                              }));
                            }}
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              border: "none",
                              background: "#ef4444",
                              color: "#fff",
                              cursor: "pointer",
                              fontWeight: "700",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <span
                      style={{
                        color: "#401e37",
                        fontWeight: "600",
                        marginTop: "16px",
                      }}
                    >
                      Add More Images
                    </span>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "#401e37",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        marginBottom: "18px",
                      }}
                    >
                      +
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: "#401e37",
                        fontWeight: "600",
                      }}
                    >
                      Upload Hero Images
                    </p>
                  </>
                )}
              </label>

              {uploading && (
                <p
                  style={{
                    marginTop: "14px",
                    color: "#6b7280",
                  }}
                >
                  Uploading image...
                </p>
              )}
            </div>
          </div>
          FULL DESCRIPTION
          <textarea
            name="fullDescription"
            placeholder="Full Description"
            value={formData.fullDescription}
            onChange={handleChange}
            rows="6"
            style={{
              ...textareaStyle,
              marginTop: "18px",
            }}
          />
          <input
            type="text"
            name="featuredVideo"
            placeholder="Behind The Experience Video URL"
            value={formData.featuredVideo}
            onChange={handleChange}
            style={{
              ...inputStyle,
              marginTop: "18px",
            }}
          />
          {/* GALLERY */}
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h3
              style={{
                color: "#401e37",
                marginBottom: "18px",
                fontSize: "20px",
              }}
            >
              Gallery Images
            </h3>

            {/* UPLOAD BUTTON */}
            <label
              style={{
                border: "1px dashed #d8cfc8",
                borderRadius: "18px",
                background: "#faf8f6",
                padding: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                marginBottom: "24px",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                style={{
                  display: "none",
                }}
              />

              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#401e37",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                +
              </div>

              <span
                style={{
                  color: "#401e37",
                  fontWeight: "600",
                }}
              >
                Upload Gallery Image
              </span>
            </label>

            {/* GALLERY GRID */}
            {formData.gallery.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "18px",
                }}
              >
                {formData.gallery.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      borderRadius: "18px",
                      overflow: "hidden",
                      height: "180px",
                    }}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#ef4444",
                        color: "#ffffff",
                        border: "none",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* BUTTON */}
          <button
            type="submit"
            style={{
              marginTop: "28px",
              background: "#401e37",
              color: "#ffffff",
              border: "none",
              padding: "16px 30px",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Update Experience
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

const secondaryButton = {
  background: "#ffffff",
  color: "#401e37",
  border: "1px solid #ddd3cd",
  padding: "14px 20px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
};

const inputStyle = {
  height: "54px",
  borderRadius: "14px",
  border: "1px solid #ddd3cd",
  background: "#faf8f6",
  padding: "0 18px",
  fontSize: "15px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const textareaStyle = {
  borderRadius: "14px",
  border: "1px solid #ddd3cd",
  background: "#faf8f6",
  padding: "18px",
  fontSize: "15px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  resize: "vertical",
  lineHeight: "1.7",
};

export default EditExperience;
