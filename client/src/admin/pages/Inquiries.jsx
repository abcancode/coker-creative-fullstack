import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import AdminLayout from "../layouts/AdminLayout";

import {
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../../services/inquiryService";

function Inquiries() {
  const [inquiries, setInquiries] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await getInquiries();

      setInquiries(data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  // STATUS UPDATE
  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);

      toast.success("Status updated");

      fetchInquiries();
    } catch (error) {
      console.log(error);

      toast.error("Failed to update status");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this inquiry?");

    if (!confirmDelete) return;

    try {
      await deleteInquiry(id);

      toast.success("Inquiry deleted");

      fetchInquiries();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Client Inquiries"
      subtitle="Manage incoming experience requests."
    >
      {loading ? (
        <p>Loading...</p>
      ) : inquiries.length === 0 ? (
        <div style={emptyStyle}>
          <h2>No inquiries yet</h2>

          <p>New client inquiries will appear here.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
        >
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} style={cardStyle}>
              {/* TOP */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "8px",
                      color: "#401e37",
                    }}
                  >
                    {inquiry.name}
                  </h2>

                  <p style={metaText}>{inquiry.email}</p>

                  {inquiry.phone && <p style={metaText}>{inquiry.phone}</p>}
                </div>

                <div
                  style={{
                    minWidth: "220px",
                  }}
                >
                  <select
                    value={inquiry.status}
                    onChange={(e) =>
                      handleStatusChange(inquiry._id, e.target.value)
                    }
                    style={selectStyle}
                  >
                    <option>New</option>

                    <option>Contacted</option>

                    <option>Consultation Scheduled</option>

                    <option>Proposal Sent</option>

                    <option>Booked</option>

                    <option>Archived</option>
                  </select>
                </div>
              </div>

              {/* GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                  marginTop: "28px",
                }}
              >
                <InfoCard title="Event Type" value={inquiry.eventType} />

                <InfoCard title="Event Date" value={inquiry.eventDate} />

                <InfoCard
                  title="Guest Count"
                  value={inquiry.estimatedGuestCount}
                />

                <InfoCard title="Budget" value={inquiry.budgetRange} />
              </div>

              {/* PRIORITIES */}
              <div
                style={{
                  marginTop: "24px",
                }}
              >
                <h4 style={sectionTitle}>Top Priorities</h4>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  {inquiry.topPriorities?.map((item, index) => (
                    <span key={index} style={badgeStyle}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* EVENT VISION */}
              <div
                style={{
                  marginTop: "28px",
                  display: "grid",
                  gap: "20px",
                }}
              >
                <TextBlock title="Desired Mood" text={inquiry.desiredMood} />

                <TextBlock title="Desired Look" text={inquiry.desiredLook} />

                {inquiry.toBeExcluded && (
                  <TextBlock
                    title="To Be Excluded"
                    text={inquiry.toBeExcluded}
                  />
                )}

                {inquiry.additionalNotes && (
                  <TextBlock
                    title="Additional Notes"
                    text={inquiry.additionalNotes}
                  />
                )}
              </div>

              {/* IMAGES */}
              {inquiry.inspirationImages?.length > 0 && (
                <div
                  style={{
                    marginTop: "28px",
                  }}
                >
                  <h4 style={sectionTitle}>Inspiration Images</h4>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {inquiry.inspirationImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "18px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* FOOTER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "32px",
                  flexWrap: "wrap",
                  gap: "18px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  Submitted {new Date(inquiry.createdAt).toLocaleDateString()}
                </p>

                <button
                  onClick={() => handleDelete(inquiry._id)}
                  style={deleteButton}
                >
                  Delete Inquiry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

// COMPONENTS
const InfoCard = ({ title, value }) => (
  <div style={infoCard}>
    <p style={infoTitle}>{title}</p>

    <h3 style={infoValue}>{value || "-"}</h3>
  </div>
);

const TextBlock = ({ title, text }) => (
  <div>
    <h4 style={sectionTitle}>{title}</h4>

    <p style={paragraph}>{text}</p>
  </div>
);

// STYLES
const cardStyle = {
  background: "#ffffff",
  borderRadius: "30px",
  padding: "32px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.04)",
};

const emptyStyle = {
  background: "#ffffff",
  borderRadius: "30px",
  padding: "60px",
  textAlign: "center",
};

const metaText = {
  margin: "6px 0",
  color: "#6b7280",
};

const selectStyle = {
  width: "100%",
  height: "52px",
  borderRadius: "14px",
  border: "1px solid #ddd3cd",
  background: "#faf8f6",
  padding: "0 16px",
  fontSize: "14px",
  outline: "none",
};

const infoCard = {
  background: "#f8f6f4",
  padding: "18px",
  borderRadius: "18px",
};

const infoTitle = {
  margin: 0,
  color: "#9ca3af",
  fontSize: "13px",
};

const infoValue = {
  marginTop: "10px",
  marginBottom: 0,
  color: "#401e37",
};

const sectionTitle = {
  marginBottom: "12px",
  color: "#401e37",
};

const paragraph = {
  margin: 0,
  color: "#6b7280",
  lineHeight: "1.8",
};

const badgeStyle = {
  background: "#401e37",
  color: "#ffffff",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "13px",
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

export default Inquiries;
