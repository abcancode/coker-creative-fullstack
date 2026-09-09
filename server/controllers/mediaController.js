import imageKit from "../config/imagekit.js";

// ============================================================
// GET IMAGEKIT UPLOAD AUTHENTICATION
// GET /api/media/imagekit-auth
// Admin only
// ============================================================

export const getImageKitAuth = async (req, res) => {
  try {
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
      return res.status(500).json({
        message: "ImageKit private key is not configured.",
      });
    }

    if (!process.env.IMAGEKIT_PUBLIC_KEY) {
      return res.status(500).json({
        message: "ImageKit public key is not configured.",
      });
    }

    const authenticationParameters =
      imageKit.helper.getAuthenticationParameters();

    return res.status(200).json({
      ...authenticationParameters,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("[Media] Failed to generate ImageKit auth:", error);

    return res.status(500).json({
      message:
        error.message || "Unable to generate ImageKit upload authentication.",
    });
  }
};
