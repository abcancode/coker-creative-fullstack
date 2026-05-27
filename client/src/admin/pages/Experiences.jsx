import { useEffect, useState } from "react";
import {
  getExperiences,
  createExperience,
  deleteExperience,
  uploadExperienceImage,
} from "../../services/experienceService";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "sonner";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) {
    return "https://placehold.co/1200x700/f5f2ef/401e37?text=Coker+Creative";
  }

  // ALREADY FULL CLOUDINARY URL
  if (image.startsWith("http")) {
    return image;
  }

  // CLOUDINARY PUBLIC ID
  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

function Experiences() {
  const [experiences, setExperiences] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    fullDescription: "",
    heroImages: [],
    gallery: [],
  });

  // FETCH EXPERIENCES
  const fetchExperiencesData = async () => {
    try {
      const data = await getExperiences();

      setExperiences(data);
    } catch (error) {
      console.log("FETCH ERROR:", error);
    }
  };

  useEffect(() => {
    fetchExperiencesData();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // HANDLE IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      setUploading(true);

      const uploadedImages = [];

      for (const file of files) {
        const imageData = new FormData();

        imageData.append("image", file);

        const data = await uploadExperienceImage(imageData);

        uploadedImages.push(data.imageUrl);
      }

      setFormData((prev) => ({
        ...prev,
        heroImages: [...prev.heroImages, ...uploadedImages],
      }));

      toast.success("Images uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // HANDLE GALLERY UPLOAD
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      setUploading(true);

      const uploadedImages = [];

      for (const file of files) {
        const imageData = new FormData();

        imageData.append("image", file);

        const data = await uploadExperienceImage(imageData);

        uploadedImages.push(data.imageUrl);
      }

      setFormData((prev) => ({
        ...prev,

        gallery: [...prev.gallery, ...uploadedImages],
      }));

      toast.success("Gallery uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Gallery upload failed");
    } finally {
      setUploading(false);
    }
  };

  // CREATE EXPERIENCE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createExperience(formData);

      toast.success("Experience created successfully");

      setFormData({
        title: "",
        slug: "",
        category: "",
        fullDescription: "",
        heroImages: [],
        gallery: [],
      });

      fetchExperiencesData();
    } catch (error) {
      console.log(error);

      toast.error("Failed to create experience");
    }
  };

  // DELETE EXPERIENCE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this experience?");

    if (!confirmDelete) return;

    try {
      await deleteExperience(id);

      fetchExperiencesData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout
      title="Experiences"
      subtitle="Create and manage luxury experiences."
    >
      {/* FORM CARD */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "28px",
          padding: "32px",
          marginBottom: "35px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bona Nova SC', serif",
            color: "#401e37",
            marginBottom: "28px",
            fontSize: "32px",
          }}
        >
          Add Experience
        </h2>

        <form onSubmit={handleSubmit}>
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

            {/* IMAGE UPLOAD */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#401e37",
                  fontWeight: "600",
                  fontSize: "14px",
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
                  overflow: "hidden",
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
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#401e37",
                    fontWeight: "600",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid #ddd3cd",
                      borderTop: "2px solid #401e37",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />

                  <span>Uploading images...</span>
                </div>
              )}

              {/* GALLERY IMAGES */}
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
                    multiple
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
                    Upload Gallery Images
                  </span>
                </label>

                {/* GALLERY GRID */}
                {formData.gallery.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
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
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,

                              gallery: prev.gallery.filter(
                                (_, i) => i !== index,
                              ),
                            }));
                          }}
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
            </div>
          </div>

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
            Create Experience
          </button>
        </form>
      </div>

      {/* EXPERIENCES LIST */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "28px",
          padding: "32px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Bona Nova SC', serif",
            color: "#401e37",
            marginBottom: "28px",
            fontSize: "32px",
          }}
        >
          All Experiences
        </h2>

        {experiences.length === 0 ? (
          <p>No experiences found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {experiences.map((experience) => (
              <div
                key={experience._id}
                style={{
                  padding: "24px",
                  borderRadius: "22px",
                  background: "#faf8f6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "18px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={getImageUrl(experience.heroImages?.[0])}
                    alt={experience.title}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "16px",
                    }}
                  />

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: "#401e37",
                        fontSize: "24px",
                        fontFamily: "'Bona Nova SC', serif",
                      }}
                    >
                      {experience.title}
                    </h3>

                    <p
                      style={{
                        margin: "10px 0",
                        color: "#6b7280",
                      }}
                    >
                      {experience.category}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() =>
                      (window.location.href = `/admin/experiences/${experience._id}`)
                    }
                    style={viewButton}
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(experience._id)}
                    style={deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const viewButton = {
  background: "#401e37",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};

const deleteButton = {
  background: "#ef4444",
  color: "#ffffff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
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

export default Experiences;
