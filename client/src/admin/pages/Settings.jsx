import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import AdminLayout from "../layouts/AdminLayout";

import {
  getSiteContent,
  updateSiteContent,
} from "../../services/siteContentService";

import { uploadExperienceImage } from "../../services/experienceService";

function Settings() {
  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [activeSection, setActiveSection] = useState("hero");

  const [formData, setFormData] = useState({
    heroTitle: "",
    heroVideo: "",
    heroPoster: "",

    primaryButtonText: "",
    primaryButtonLink: "",

    secondaryButtonText: "",
    secondaryButtonLink: "",

    seoTitle: "",
    seoDescription: "",

    whatWeDoTitle: "",
    whatWeDoDescription: "",

    footerTitleLine1: "",
    footerTitleLine2: "",
    footerTitleLine3: "",

    footerButtonText: "",
    footerButtonLink: "",

    footerInstagram: "",
    footerFacebook: "",
    footerTwitter: "",

    footerEmail: "",
    footerHandle: "",
    footerLocations: "",
    footerCopyright: "",

    whoHeroTitle: "",

    whoHeroImages: [],

    whoSeoTitle: "",

    whoSeoDescription: "",

    ourStoryTitle: "",

    ourStoryParagraph1: "",

    ourStoryParagraph2: "",

    ourStoryImages: [],

    coreValuesTitle: "",

    coreValuesDescription: "",

    coreValueOne: "",

    coreValueTwo: "",

    coreValueThree: "",

    visionaryTitle: "",

    visionaryDescription: "",

    visionaryName: "",

    visionaryRole: "",

    visionaryImage: "",

    visualTransitionImages: [],

    startExperienceTitle: "",

    startExperienceSubtitle: "",

    startExperienceImages: [],
  });

  // FETCH CONTENT
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      if (data) {
        setFormData({
          heroTitle: data.heroTitle || "",

          heroVideo: data.heroVideo || "",

          heroPoster: data.heroPoster || "",

          primaryButtonText: data.primaryButtonText || "",

          primaryButtonLink: data.primaryButtonLink || "",

          secondaryButtonText: data.secondaryButtonText || "",

          secondaryButtonLink: data.secondaryButtonLink || "",

          seoTitle: data.seoTitle || "",

          seoDescription: data.seoDescription || "",

          whatWeDoTitle: data.whatWeDoTitle || "",

          whatWeDoDescription: data.whatWeDoDescription || "",

          footerTitleLine1: data.footerTitleLine1 || "",

          footerTitleLine2: data.footerTitleLine2 || "",

          footerTitleLine3: data.footerTitleLine3 || "",

          footerButtonText: data.footerButtonText || "",

          footerButtonLink: data.footerButtonLink || "",

          footerInstagram: data.footerInstagram || "",

          footerFacebook: data.footerFacebook || "",

          footerTwitter: data.footerTwitter || "",

          footerEmail: data.footerEmail || "",

          footerHandle: data.footerHandle || "",

          footerLocations: data.footerLocations || "",

          footerCopyright: data.footerCopyright || "",

          whoHeroTitle: data.whoHeroTitle || "",

          whoHeroImages: data.whoHeroImages || [],

          whoSeoTitle: data.whoSeoTitle || "",

          whoSeoDescription: data.whoSeoDescription || "",

          ourStoryTitle: data.ourStoryTitle || "",

          ourStoryParagraph1: data.ourStoryParagraph1 || "",

          ourStoryParagraph2: data.ourStoryParagraph2 || "",

          ourStoryImages: data.ourStoryImages || [],

          coreValuesTitle: data.coreValuesTitle || "",

          coreValuesDescription: data.coreValuesDescription || "",

          coreValueOne: data.coreValueOne || "",

          coreValueTwo: data.coreValueTwo || "",

          coreValueThree: data.coreValueThree || "",

          visionaryTitle: data.visionaryTitle || "",

          visionaryDescription: data.visionaryDescription || "",

          visionaryName: data.visionaryName || "",

          visionaryRole: data.visionaryRole || "",

          visionaryImage: data.visionaryImage || "",

          visualTransitionImages: data.visualTransitionImages || [],

          startExperienceTitle: data.startExperienceTitle || "",

          startExperienceSubtitle: data.startExperienceSubtitle || "",

          startExperienceImages: data.startExperienceImages || [],
        });
      }
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

  const handleWhoHeroImages = async (e) => {
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
        whoHeroImages: [...prev.whoHeroImages, ...uploadedImages],
      }));

      toast.success("Images uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleOurStoryImages = async (e) => {
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
        ourStoryImages: [...prev.ourStoryImages, ...uploadedImages],
      }));

      toast.success("Story images uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVisionaryImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const imageData = new FormData();

      imageData.append("image", file);

      const data = await uploadExperienceImage(imageData);

      setFormData((prev) => ({
        ...prev,
        visionaryImage: data.imageUrl,
      }));

      toast.success("Visionary image uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVisualTransitionUpload = async (e) => {
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

        visualTransitionImages: [
          ...prev.visualTransitionImages,
          ...uploadedImages,
        ],
      }));

      toast.success("Transition images uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleStartExperienceUpload = async (e) => {
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

        startExperienceImages: [
          ...prev.startExperienceImages,
          ...uploadedImages,
        ],
      }));

      toast.success("Images uploaded");
    } catch (error) {
      console.log(error);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // SAVE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateSiteContent("home", formData);

      toast.success("Changes saved successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Website Settings"
      subtitle="Manage global website content."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "28px",
        }}
      >
        {/* SIDEBAR */}
        <div style={sidebarStyle}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                ...sidebarButton,
                background:
                  activeSection === section.id ? "#401e37" : "transparent",

                color: activeSection === section.id ? "#ffffff" : "#401e37",
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={contentStyle}>
          <form onSubmit={handleSubmit}>
            {/* HERO */}
            {activeSection === "hero" && (
              <Section title="Homepage Hero">
                <Input
                  name="heroTitle"
                  placeholder="Hero Title"
                  value={formData.heroTitle}
                  onChange={handleChange}
                />

                <Input
                  name="heroVideo"
                  placeholder="Hero Video URL"
                  value={formData.heroVideo}
                  onChange={handleChange}
                />

                <Input
                  name="heroPoster"
                  placeholder="Hero Poster URL"
                  value={formData.heroPoster}
                  onChange={handleChange}
                />

                <Input
                  name="primaryButtonText"
                  placeholder="Primary Button Text"
                  value={formData.primaryButtonText}
                  onChange={handleChange}
                />

                <Input
                  name="primaryButtonLink"
                  placeholder="Primary Button Link"
                  value={formData.primaryButtonLink}
                  onChange={handleChange}
                />

                <Input
                  name="secondaryButtonText"
                  placeholder="Secondary Button Text"
                  value={formData.secondaryButtonText}
                  onChange={handleChange}
                />

                <Input
                  name="secondaryButtonLink"
                  placeholder="Secondary Button Link"
                  value={formData.secondaryButtonLink}
                  onChange={handleChange}
                />
              </Section>
            )}

            {/* SEO */}
            {activeSection === "seo" && (
              <Section title="SEO">
                <Input
                  name="seoTitle"
                  placeholder="SEO Title"
                  value={formData.seoTitle}
                  onChange={handleChange}
                />

                <Textarea
                  name="seoDescription"
                  placeholder="SEO Description"
                  value={formData.seoDescription}
                  onChange={handleChange}
                />
              </Section>
            )}

            {/* INTRO */}
            {activeSection === "intro" && (
              <Section title="Homepage Intro">
                <Input
                  name="whatWeDoTitle"
                  placeholder="What We Do Title"
                  value={formData.whatWeDoTitle}
                  onChange={handleChange}
                />

                <Textarea
                  name="whatWeDoDescription"
                  placeholder="What We Do Description"
                  value={formData.whatWeDoDescription}
                  onChange={handleChange}
                />
              </Section>
            )}

            {activeSection === "whoHero" && (
              <Section title="Who We Are Hero">
                <Input
                  name="whoHeroTitle"
                  placeholder="Who We Are Hero Title"
                  value={formData.whoHeroTitle}
                  onChange={handleChange}
                />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleWhoHeroImages}
                />

                {uploading && <p>Uploading images...</p>}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {formData.whoHeroImages.map((image, index) => (
                    <img
                      key={index}
                      src={`https://res.cloudinary.com/djp4j1mvn/image/upload/${image}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "14px",
                      }}
                    />
                  ))}
                </div>
              </Section>
            )}

            {activeSection === "whoSeo" && (
              <Section title="Who We Are SEO">
                <Input
                  name="whoSeoTitle"
                  placeholder="Who SEO Title"
                  value={formData.whoSeoTitle}
                  onChange={handleChange}
                />

                <Textarea
                  name="whoSeoDescription"
                  placeholder="Who SEO Description"
                  value={formData.whoSeoDescription}
                  onChange={handleChange}
                />
              </Section>
            )}

            {activeSection === "ourStory" && (
              <Section title="Our Story">
                <Input
                  name="ourStoryTitle"
                  placeholder="Our Story Title"
                  value={formData.ourStoryTitle}
                  onChange={handleChange}
                />

                <Textarea
                  name="ourStoryParagraph1"
                  placeholder="Paragraph 1"
                  value={formData.ourStoryParagraph1}
                  onChange={handleChange}
                />

                <Textarea
                  name="ourStoryParagraph2"
                  placeholder="Paragraph 2"
                  value={formData.ourStoryParagraph2}
                  onChange={handleChange}
                />

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleOurStoryImages}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {formData.ourStoryImages.map((image, index) => (
                    <img
                      key={index}
                      src={`https://res.cloudinary.com/djp4j1mvn/image/upload/${image}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "14px",
                      }}
                    />
                  ))}
                </div>
              </Section>
            )}

            {activeSection === "coreValues" && (
              <Section title="Core Values">
                <Input
                  name="coreValuesTitle"
                  placeholder="Section Title"
                  value={formData.coreValuesTitle}
                  onChange={handleChange}
                />

                <Textarea
                  name="coreValuesDescription"
                  placeholder="Section Description"
                  value={formData.coreValuesDescription}
                  onChange={handleChange}
                />

                <Input
                  name="coreValueOne"
                  placeholder="Core Value One"
                  value={formData.coreValueOne}
                  onChange={handleChange}
                />

                <Input
                  name="coreValueTwo"
                  placeholder="Core Value Two"
                  value={formData.coreValueTwo}
                  onChange={handleChange}
                />

                <Input
                  name="coreValueThree"
                  placeholder="Core Value Three"
                  value={formData.coreValueThree}
                  onChange={handleChange}
                />
              </Section>
            )}

            {activeSection === "visionary" && (
              <Section title="Visionary Section">
                <Input
                  name="visionaryTitle"
                  placeholder="Visionary Title"
                  value={formData.visionaryTitle}
                  onChange={handleChange}
                />

                <Textarea
                  name="visionaryDescription"
                  placeholder="Visionary Description"
                  value={formData.visionaryDescription}
                  onChange={handleChange}
                />

                <Input
                  name="visionaryName"
                  placeholder="Visionary Name"
                  value={formData.visionaryName}
                  onChange={handleChange}
                />

                <Input
                  name="visionaryRole"
                  placeholder="Visionary Role"
                  value={formData.visionaryRole}
                  onChange={handleChange}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleVisionaryImage}
                />

                {formData.visionaryImage && (
                  <img
                    src={`https://res.cloudinary.com/djp4j1mvn/image/upload/${formData.visionaryImage}`}
                    alt=""
                    style={{
                      width: "220px",
                      borderRadius: "18px",
                    }}
                  />
                )}
              </Section>
            )}

            {activeSection === "visual-transition" && (
              <div>
                <h2>Visual Transition</h2>

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
                    multiple
                    accept="image/*"
                    onChange={handleVisualTransitionUpload}
                    style={{
                      display: "none",
                    }}
                  />

                  <p>Upload Transition Images</p>
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "18px",
                    marginTop: "24px",
                  }}
                >
                  {formData.visualTransitionImages.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                      }}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "18px",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,

                            visualTransitionImages:
                              prev.visualTransitionImages.filter(
                                (_, i) => i !== index,
                              ),
                          }));
                        }}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#ef4444",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "start-experience" && (
              <div>
                <h2>Start Experience</h2>

                <input
                  type="text"
                  name="startExperienceTitle"
                  placeholder="Page Title"
                  value={formData.startExperienceTitle}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <textarea
                  name="startExperienceSubtitle"
                  placeholder="Subtitle"
                  value={formData.startExperienceSubtitle}
                  onChange={handleChange}
                  rows="4"
                  style={textareaStyle}
                />

                <label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleStartExperienceUpload}
                  />
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "18px",
                    marginTop: "24px",
                  }}
                >
                  {formData.startExperienceImages.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                      }}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "18px",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,

                            startExperienceImages:
                              prev.startExperienceImages.filter(
                                (_, i) => i !== index,
                              ),
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FOOTER */}
            {activeSection === "footer" && (
              <Section title="Footer Content">
                <Input
                  name="footerTitleLine1"
                  placeholder="Footer Title Line 1"
                  value={formData.footerTitleLine1}
                  onChange={handleChange}
                />

                <Input
                  name="footerTitleLine2"
                  placeholder="Footer Title Line 2"
                  value={formData.footerTitleLine2}
                  onChange={handleChange}
                />

                <Input
                  name="footerTitleLine3"
                  placeholder="Footer Title Line 3"
                  value={formData.footerTitleLine3}
                  onChange={handleChange}
                />

                <Input
                  name="footerButtonText"
                  placeholder="Footer Button Text"
                  value={formData.footerButtonText}
                  onChange={handleChange}
                />

                <Input
                  name="footerButtonLink"
                  placeholder="Footer Button Link"
                  value={formData.footerButtonLink}
                  onChange={handleChange}
                />

                <Input
                  name="footerEmail"
                  placeholder="Footer Email"
                  value={formData.footerEmail}
                  onChange={handleChange}
                />

                <Input
                  name="footerHandle"
                  placeholder="Footer Handle"
                  value={formData.footerHandle}
                  onChange={handleChange}
                />

                <Input
                  name="footerLocations"
                  placeholder="Footer Locations"
                  value={formData.footerLocations}
                  onChange={handleChange}
                />

                <Input
                  name="footerCopyright"
                  placeholder="Footer Copyright"
                  value={formData.footerCopyright}
                  onChange={handleChange}
                />
              </Section>
            )}

            {/* SOCIALS */}
            {activeSection === "socials" && (
              <Section title="Social Links">
                <Input
                  name="footerInstagram"
                  placeholder="Instagram URL"
                  value={formData.footerInstagram}
                  onChange={handleChange}
                />

                <Input
                  name="footerFacebook"
                  placeholder="Facebook URL"
                  value={formData.footerFacebook}
                  onChange={handleChange}
                />

                <Input
                  name="footerTwitter"
                  placeholder="Twitter/X URL"
                  value={formData.footerTwitter}
                  onChange={handleChange}
                />
              </Section>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              style={saveButton}
            >
              {uploading
                ? "Uploading..."
                : loading
                  ? "Saving..."
                  : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

// SECTIONS
const sections = [
  {
    id: "hero",
    label: "Homepage Hero",
  },
  // {
  //   id: "seo",
  //   label: "Homepage SEO",
  // },
  {
    id: "intro",
    label: "Homepage Intro",
  },

  {
    id: "whoHero",
    label: "Who We Are Hero",
  },

  // {
  //   id: "whoSeo",
  //   label: "Who We Are SEO",
  // },
  {
    id: "ourStory",
    label: "Our Story",
  },
  {
    id: "coreValues",
    label: "Core Values",
  },
  {
    id: "visionary",
    label: "Visionary",
  },
  {
    id: "visual-transition",
    label: "Visual Transition",
  },
  {
    id: "start-experience",
    label: "Start Experience",
  },
  {
    id: "socials",
    label: "Social Links",
  },
  {
    id: "footer",
    label: "Footer Content",
  },
];

// REUSABLE COMPONENTS
const Section = ({ title, children }) => (
  <div>
    <h2
      style={{
        marginTop: 0,
        marginBottom: "24px",
        color: "#401e37",
        fontFamily: "'Bona Nova SC', serif",
      }}
    >
      {title}
    </h2>

    <div
      style={{
        display: "grid",
        gap: "18px",
      }}
    >
      {children}
    </div>
  </div>
);

const Input = (props) => <input {...props} style={inputStyle} />;

const Textarea = (props) => (
  <textarea
    {...props}
    rows="6"
    style={{
      ...inputStyle,
      height: "180px",
      padding: "18px",
      resize: "vertical",
    }}
  />
);

// STYLES
const sidebarStyle = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  height: "fit-content",
  display: "grid",
  gap: "10px",
};

const sidebarButton = {
  border: "none",
  height: "52px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "left",
  padding: "0 18px",
  transition: "0.3s ease",
};

const contentStyle = {
  background: "#ffffff",
  padding: "32px",
  borderRadius: "28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
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
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #ddd",
  background: "#ffffff",
  fontSize: "15px",
  resize: "vertical",
  outline: "none",
  minHeight: "120px",
  marginTop: "16px",
};

const saveButton = {
  marginTop: "28px",
  background: "#401e37",
  color: "#ffffff",
  border: "none",
  padding: "14px 24px",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: "600",
};

export default Settings;
