// StartYourExperienceSection.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import emailjs from "@emailjs/browser";
import { createInquiry } from "../services/inquiryService";
import { getSiteContent } from "../services/siteContentService";
import "../styles/start-your-experience.css";
import { motion, AnimatePresence } from "framer-motion";

/* ✅ Success images */
const successImages = {
  Wedding: "/assets/images/success-wedding.png",
  "Social Event": "/assets/images/success-social.jpeg",
  "Corporate Event": "/assets/images/success-corporate.jpg",
};

/* ============================
   LEFT VISUAL — CLOUDINARY
============================ */
const CLOUD_NAME = "djp4j1mvn";

const cld = (publicId, w = 1600) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto:best,dpr_auto,w_${w},c_limit/${publicId}`;

const VISUAL_FALLBACK_LOCAL = [
  "/assets/images/b-visual/book-visual-1.jpg",
  "/assets/images/b-visual/book-visual-2.jpg",
  "/assets/images/b-visual/book-visual-3.jpg",
  "/assets/images/b-visual/book-visual-4.jpg",
  "/assets/images/b-visual/book-visual-5.jpg",
  "/assets/images/b-visual/book-visual-6.jpg",
];

const toUrl = (value, w = 1600) => {
  if (!value) return "";
  const str = String(value);
  if (str.startsWith("http://") || str.startsWith("https://")) return str;
  if (str.startsWith("/")) return str; // local path
  return cld(str, w); // cloudinary public id
};

const StartYourExperienceSection = () => {
  const sectionRef = useRef(null);

  const [content, setContent] = useState(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ✅ Left visual: bgA active on first paint + swap only after next loads */
  const [visualReady, setVisualReady] = useState(false);
  const visualARef = useRef(null);
  const visualBRef = useRef(null);
  const visualIntervalRef = useRef(null);

  const VISUAL_IMAGES = useMemo(() => {
    const source =
      content?.startExperienceImages?.length > 0
        ? content.startExperienceImages
        : VISUAL_FALLBACK_LOCAL;

    return source.map((img) => toUrl(img, 1600)).filter(Boolean);
  }, [content]);

  useEffect(() => {
    emailjs.init("sjF1HA52MC4U8NBu5");
  }, []);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getSiteContent("home");

      setContent(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSubmitted && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isSubmitted]);

  /* ============================
     STEP 1–5 — STATE
  ============================ */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",

    eventType: "",
    estimatedGuestCount: "",
    guestType: "",
    primaryDecisionMaker: "",
    decisionMakerName: "",

    currency: "USD",
    budgetRange: 3,
    topPriorities: [],

    desiredMood: "",
    desiredLook: "",
    inspirationImages: [],
    inspirationLink: "",

    toBeExcluded: "",
    additionalNotes: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "inspirationImages" && files) {
      if (files.length > 6) {
        alert("Please upload a maximum of 6 inspiration images.");
        e.target.value = "";
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? Array.from(files) : value,
    }));
  };

  const handlePriorityChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        if (prev.topPriorities.length >= 3) {
          alert("Please select a maximum of three priorities.");
          return prev;
        }
        return {
          ...prev,
          topPriorities: [...prev.topPriorities, value],
        };
      } else {
        return {
          ...prev,
          topPriorities: prev.topPriorities.filter((item) => item !== value),
        };
      }
    });
  };

  /* ============================
     CLOUDINARY (UPLOAD - FIXED)
  ============================ */
  const uploadImagesToCloudinary = async (files) => {
    const CLOUD_NAME_UPLOAD = "djknotyww";
    const UPLOAD_PRESET = "coker-creative-uploads";

    const uploads = files.map(async (file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);
      data.append("quality", "auto");
      data.append("fetch_format", "auto");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME_UPLOAD}/image/upload`,
        { method: "POST", body: data },
      );

      const result = await res.json();
      return result.secure_url;
    });

    return Promise.all(uploads);
  };

  const budgetLabels = {
    USD: {
      1: "$1,000 – $5,000",
      2: "$5,000 – $10,000",
      3: "$10,000 – $20,000",
      4: "$20,000 – $40,000",
      5: "$40,000+",
    },
    NGN: {
      1: "₦1,000,000 – ₦5,000,000",
      2: "₦5,000,000 – ₦10,000,000",
      3: "₦10,000,000 – ₦20,000,000",
      4: "₦20,000,000 – ₦40,000,000",
      5: "₦40,000,000+",
    },
    EUR: {
      1: "€1,000 – €5,000",
      2: "€5,000 – €10,000",
      3: "€10,000 – €20,000",
      4: "€20,000 – €40,000",
      5: "€40,000+",
    },
    GBP: {
      1: "£1,000 – £5,000",
      2: "£5,000 – £10,000",
      3: "£10,000 – £20,000",
      4: "£20,000 – £40,000",
      5: "£40,000+",
    },
  };

  /* ============================
     EMAILJS (SAFE)
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.topPriorities.length !== 3) {
      alert("Please select exactly three priorities.");
      return;
    }

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    try {
      setIsSubmitting(true);
      setIsSubmitted(true);

      (async () => {
        try {
          const imageUrls =
            formData.inspirationImages.length > 0
              ? await uploadImagesToCloudinary(formData.inspirationImages)
              : [];

          const {
            inspirationImages,
            topPriorities,
            budgetRange,
            currency,
            ...safeFormData
          } = formData;

          // SAVE TO DATABASE
          await createInquiry({
            ...safeFormData,

            currency,

            budgetRange: budgetLabels[currency][budgetRange],

            topPriorities,

            inspirationImages: imageUrls,
          });

          const templateParams = {
            ...safeFormData,
            currency, // ✅ NEW
            budgetRange: budgetLabels[currency][budgetRange],
            topPriorities: topPriorities.join(", "),
            inspirationImageCount: imageUrls.length,
            inspirationImageLinks: imageUrls.join("\n"),
          };

          await emailjs.send(
            "service_3al6zx3",
            "template_nfe6nll",
            templateParams,
          );

          await emailjs.send("service_3al6zx3", "template_5nalufr", {
            name: safeFormData.name,
            email: safeFormData.email,
            year: new Date().getFullYear(),
          });
        } catch (bgError) {
          console.error("Background submission failed:", bgError);
        } finally {
          setIsSubmitting(false);
        }
      })();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  /* ============================
     LEFT VISUAL — CLOUDINARY:
     ✅ BG-A FIRST PAINT
     ✅ SWAP ONLY AFTER LOAD
     ✅ NO WHITE/BLACK HOLD
  ============================ */

  // preload rest after mount (don’t block first paint)
  useEffect(() => {
    if (VISUAL_IMAGES.length <= 1) return;
    VISUAL_IMAGES.slice(1).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [VISUAL_IMAGES]);

  // readiness gating (only used for swap timing; bgA still paints immediately)
  useEffect(() => {
    if (!VISUAL_IMAGES.length) return;

    const img = new Image();
    const onReady = () => setVisualReady(true);

    img.addEventListener("load", onReady);
    img.src = VISUAL_IMAGES[0];

    if (img.complete) onReady();

    return () => img.removeEventListener("load", onReady);
  }, [VISUAL_IMAGES]);

  // slideshow: bgA already visible on first paint; swap only after next loads
  useEffect(() => {
    if (!visualReady) return;
    if (!VISUAL_IMAGES.length) return;

    const a = visualARef.current;
    const b = visualBRef.current;
    if (!a || !b) return;

    if (visualIntervalRef.current) {
      clearInterval(visualIntervalRef.current);
      visualIntervalRef.current = null;
    }

    let index = 0;
    let active = a;
    let inactive = b;
    let isSwapping = false;

    // route-change safe reset while keeping bgA active
    a.className = "book-visual-bg is-active is-zoom";
    b.className = "book-visual-bg";
    b.style.backgroundImage = "";

    const swapTo = (nextIndex) => {
      if (isSwapping) return;
      isSwapping = true;

      const img = new Image();
      img.decoding = "async";
      img.src = VISUAL_IMAGES[nextIndex];

      const doSwap = () => {
        inactive.style.backgroundImage = `url(${VISUAL_IMAGES[nextIndex]})`;

        // reflow ensures class animation retriggers reliably
        void inactive.offsetHeight;

        inactive.classList.add("is-active", "is-zoom");
        active.classList.remove("is-active", "is-zoom");

        [active, inactive] = [inactive, active];
        isSwapping = false;
      };

      if (img.complete) {
        doSwap();
        return;
      }

      img.onload = doSwap;
      img.onerror = () => {
        isSwapping = false;
      };
    };

    visualIntervalRef.current = setInterval(() => {
      index = (index + 1) % VISUAL_IMAGES.length;
      swapTo(index);
    }, 6500);

    return () => {
      if (visualIntervalRef.current) {
        clearInterval(visualIntervalRef.current);
        visualIntervalRef.current = null;
      }
    };
  }, [visualReady, VISUAL_IMAGES]);

  /* ============================
     ✅ MULTI-STEP FORM 
  ============================ */
  useEffect(() => {
    const form = document.getElementById("experienceForm");
    if (!form) return;

    const steps = form.querySelectorAll(".form-step");
    const indicator = document.getElementById("stepIndicator");
    const nextBtn = document.getElementById("nextStep");
    const prevBtn = document.getElementById("prevStep");
    const submitBtn = document.getElementById("submitBtn");

    if (!steps.length || !indicator || !nextBtn || !prevBtn || !submitBtn)
      return;

    let currentStep = 0;

    const updateSteps = () => {
      steps.forEach((step, i) =>
        step.classList.toggle("active", i === currentStep),
      );

      indicator.textContent = `${String(currentStep + 1).padStart(2, "0")} / ${
        steps.length
      }`;

      prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
      nextBtn.style.display =
        currentStep === steps.length - 1 ? "none" : "inline-block";
      submitBtn.style.display =
        currentStep === steps.length - 1 ? "inline-block" : "none";
    };

    const validateCurrentStep = () => {
      const fields = steps[currentStep].querySelectorAll(
        "input, select, textarea",
      );

      for (let field of fields) {
        if (field.offsetParent === null) continue;
        if (field.hasAttribute("required") && !field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      return true;
    };

    nextBtn.onclick = () => {
      if (!validateCurrentStep()) return;
      currentStep++;
      updateSteps();
    };

    prevBtn.onclick = () => {
      currentStep--;
      updateSteps();
    };

    updateSteps();
  }, []);

  const SuccessView = () => {
    const image =
      successImages[formData.eventType] || "/assets/images/success-default.jpg";

    return (
      <motion.div
        className="experience-success"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div
          className="success-image"
          style={{ backgroundImage: `url(${image})` }}
        />

        <div className="success-content">
          <h2>Hello {formData.name},</h2>

          <p>
            Thank you for considering <strong>Coker Creative</strong> for your
            event experience.
          </p>

          <p>
            We’ll review your details carefully and will be in touch within the
            next <strong>48 hours</strong>.
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="book-experience" ref={sectionRef}>
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <SuccessView key="success" />
        ) : (
          <div key="form">
            {/* HEADER */}
            <div className="book-experience-header">
              <h2>{content?.startExperienceTitle || "Let’s begin."}</h2>

              <p className="subheading">
                {content?.startExperienceSubtitle ||
                  "Tell us about what you're building. We'll take it from there."}
              </p>
            </div>

            <div className="book-experience-inner">
              {/* LEFT — VISUAL EXPERIENCE (CLOUDINARY PATTERN) */}
              <div
                className="experience-visual"
                style={{
                  // ✅ instant first paint fallback (no white/black)
                  backgroundImage: `url(${VISUAL_IMAGES[0] || ""})`,
                }}
              >
                {/* ✅ hidden preload (forces eager fetch) */}
                {VISUAL_IMAGES[0] && (
                  <img
                    className="book-visual-preload"
                    src={VISUAL_IMAGES[0]}
                    alt=""
                    decoding="async"
                    loading="eager"
                    fetchPriority="high"
                  />
                )}

                {/* ✅ bgA active from first paint */}
                <div
                  ref={visualARef}
                  className="book-visual-bg is-active is-zoom"
                  style={{
                    backgroundImage: `url(${VISUAL_IMAGES[0] || ""})`,
                  }}
                />
                <div ref={visualBRef} className="book-visual-bg" />
              </div>

              {/* RIGHT — MULTI STEP FORM */}
              <form
                className="experience-form"
                id="experienceForm"
                onSubmit={handleSubmit}
              >
                <div className="form-progress">
                  <span id="stepIndicator">01 / 05</span>
                </div>

                {/* STEP 1 */}
                <div className="form-step active">
                  <h3>Your Details</h3>

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <div className="date-field">
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                    />

                    <span className="date-placeholder">
                      {formData.eventDate ? "" : "Event Date"}
                    </span>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="form-step">
                  <h3>Event Overview</h3>

                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Event Type
                    </option>
                    <option>Wedding</option>
                    <option>Social Event</option>
                    <option>Corporate Event</option>
                  </select>

                  <input
                    type="text"
                    name="estimatedGuestCount"
                    placeholder="Estimated Guest Count"
                    value={formData.estimatedGuestCount}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* STEP 3 */}
                <div className="form-step">
                  <h3>Scale & Budget</h3>

                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                  >
                    <option value="USD">USD ($)</option>
                    <option value="NGN">Naira (₦)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">Pounds (£)</option>
                  </select>

                  <div className="budget-range">
                    <label className="budget-label">
                      Estimated Event Budget
                    </label>

                    <div className="budget-value">
                      {budgetLabels[formData.currency][formData.budgetRange]}
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={formData.budgetRange}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          budgetRange: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="checkbox-group">
                    <p className="checkbox-label">
                      What are your top three priorities?
                    </p>

                    {[
                      "Design and Decor",
                      "Guest Experience",
                      "Food and Drinks",
                      "Entertainment",
                      "Timely Execution",
                      "A mix of all the above ",
                    ].map((priority) => (
                      <label key={priority} className="checkbox-item">
                        <input
                          type="checkbox"
                          value={priority}
                          checked={formData.topPriorities.includes(priority)}
                          onChange={handlePriorityChange}
                        />
                        <span>{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* STEP 4 */}
                <div className="form-step">
                  <h3>Event Style & Vision</h3>

                  <textarea
                    name="desiredMood"
                    rows="4"
                    placeholder="Describe how you want your event to feel"
                    value={formData.desiredMood}
                    onChange={handleChange}
                    required
                  />

                  <textarea
                    name="desiredLook"
                    rows="3"
                    placeholder="Describe how you want your event to look"
                    value={formData.desiredLook}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="inspirationImages" className="file-upload">
                    Please upload your inspiration images here
                  </label>

                  <input
                    type="file"
                    id="inspirationImages"
                    name="inspirationImages"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />

                  <div className="image-preview-grid">
                    {formData.inspirationImages.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt="preview"
                      />
                    ))}
                  </div>

                  <textarea
                    name="inspirationLink"
                    rows="2"
                    placeholder="Please share any inspiration links here"
                    value={formData.inspirationLink}
                    onChange={handleChange}
                  />
                </div>

                {/* STEP 5 */}
                <div className="form-step">
                  <h3>Final Notes</h3>

                  <select
                    name="primaryDecisionMaker"
                    value={formData.primaryDecisionMaker}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Are you the Decision Maker?
                    </option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>

                  {formData.primaryDecisionMaker === "no" && (
                    <input
                      type="text"
                      name="decisionMakerName"
                      placeholder="Who is the decision maker?"
                      value={formData.decisionMakerName}
                      onChange={handleChange}
                      required
                    />
                  )}

                  <textarea
                    name="toBeExcluded"
                    rows="4"
                    placeholder="What should be excluded from your experience?"
                    value={formData.toBeExcluded}
                    onChange={handleChange}
                  />

                  <textarea
                    name="additionalNotes"
                    rows="4"
                    placeholder="Anything else you'd like us to know?"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                  />
                </div>

                {/* ACTIONS */}
                <div className="form-actions">
                  <button type="button" className="btn-back" id="prevStep">
                    Back
                  </button>
                  <button type="button" className="btn-next" id="nextStep">
                    Next
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    id="submitBtn"
                    disabled={isSubmitting}
                    style={{
                      opacity: isSubmitting ? 0.6 : 1,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmitting
                      ? "Submitting Your Request..."
                      : "SUBMIT EXPERIENCE REQUEST"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StartYourExperienceSection;
