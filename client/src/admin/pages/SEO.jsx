import AdminLayout from "../layouts/AdminLayout";

function SEO() {
  return (
    <AdminLayout
      title="SEO Manager"
      subtitle="Manage SEO settings and metadata."
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
          SEO Manager
        </h2>

        <p
          style={{
            marginTop: "14px",
            color: "#6b7280",
            lineHeight: "1.8",
          }}
        >
          SEO management tools will be added here.
        </p>
      </div>
    </AdminLayout>
  );
}

export default SEO;
