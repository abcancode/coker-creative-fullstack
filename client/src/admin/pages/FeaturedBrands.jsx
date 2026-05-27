import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import AdminLayout from "../layouts/AdminLayout";

import {
  getBrands,
  createBrand,
  deleteBrand,
} from "../../services/featuredBrandService";

import { uploadExperienceImage } from "../../services/experienceService";

// FORMAT IMAGE URL
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `https://res.cloudinary.com/djp4j1mvn/image/upload/f_auto,q_auto,w_1400/${image}`;
};

function FeaturedBrands() {
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  });

  // FETCH BRANDS
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();

      setBrands(data);
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

  // UPLOAD LOGO
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

  // CREATE BRAND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createBrand(formData);

      toast.success("Brand added");

      setFormData({
        name: "",
        logo: "",
      });

      fetchBrands();
    } catch (error) {
      console.log(error);

      toast.error("Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteBrand(id);

      toast.success("Brand deleted");

      fetchBrands();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Featured Brands"
      subtitle="Manage homepage featured logos."
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
          <h2 style={titleStyle}>Add Brand</h2>

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
                placeholder="Brand Name"
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
                    width: "140px",
                    height: "80px",
                    objectFit: "contain",
                    background: "#f5f5f5",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              style={buttonStyle}
            >
              {loading ? "Saving..." : "Add Brand"}
            </button>
          </form>
        </div>

        {/* LIST */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>Existing Brands</h2>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {brands.map((brand) => (
              <div
                key={brand._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  border: "1px solid #ece7e2",
                  borderRadius: "16px",
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
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    style={{
                      width: "90px",
                      height: "50px",
                      objectFit: "contain",
                      background: "#f9f9f9",
                      borderRadius: "10px",
                      padding: "8px",
                    }}
                  />

                  <span
                    style={{
                      fontWeight: "600",
                      color: "#401e37",
                    }}
                  >
                    {brand.name}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(brand._id)}
                  style={{
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

export default FeaturedBrands;
