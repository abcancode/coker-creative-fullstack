import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";
import { getAdminPosts } from "../../services/journalService";

const Journal = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminPosts();

      setPosts(data || []);
    } catch (err) {
      console.error("[Journal] Failed to load posts:", err);

      setError(err.response?.data?.message || "Unable to load journal posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page">
        {/* Header */}
        <div className="admin-page-header">
          <div>
            <h1>Journal</h1>
            <p>Manage stories, announcements and updates.</p>
          </div>

          <button type="button">
            <Plus size={18} />
            <span>New Story</span>
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div className="admin-page-state">Loading journal posts...</div>
        )}

        {!loading && error && (
          <div className="admin-page-state admin-page-error">
            <p>{error}</p>

            <button type="button" onClick={loadPosts}>
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && !posts.length && (
          <div className="admin-page-state">
            <h3>No journal stories yet</h3>
            <p>
              Create your first story to start building the Coker Creative
              Journal.
            </p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div>
            {posts.map((post) => (
              <div key={post._id}>
                <h3>{post.title}</h3>

                <p>{post.excerpt}</p>

                <span>{post.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Journal;
