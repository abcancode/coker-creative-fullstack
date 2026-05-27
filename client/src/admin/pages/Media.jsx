import AdminLayout from "../layouts/AdminLayout";

function Media() {
  return (
    <AdminLayout
      title="Media Library"
      subtitle="Manage uploaded assets and media."
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "28px",
          padding: "32px",
          minHeight: "300px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#401e37",
            fontFamily: "'Bona Nova SC', serif",
          }}
        >
          Media Library
        </h2>

        <p
          style={{
            marginTop: "14px",
            color: "#6b7280",
            lineHeight: "1.8",
          }}
        >
          Media management features will be added here.
        </p>
      </div>
    </AdminLayout>
  );
}

export default Media;
