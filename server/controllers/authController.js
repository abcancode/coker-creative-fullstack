import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const adminResponse = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    res.status(201).json({
      message: "Admin registered successfully",
      admin: adminResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex");

    admin.resetPasswordToken = resetToken;

    admin.resetPasswordExpires = Date.now() + 1000 * 60 * 60;

    await admin.save();

    // RESET URL
    const resetUrl = `http://localhost:5173/admin/reset-password/${resetToken}`;

    // EMAIL
    const html = `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>

          <p>
            You requested to reset your password.
          </p>

          <p>
            Click the button below to continue:
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 22px;
              background:#401e37;
              color:#ffffff;
              text-decoration:none;
              border-radius:8px;
              margin-top:12px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:24px;">
            This link expires in 1 hour.
          </p>
        </div>
      `;

    await sendEmail(admin.email, "Password Reset", html);

    res.json({
      message: "Reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    const admin = await Admin.findOne({
      resetPasswordToken: token,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);

    admin.password = await bcrypt.hash(password, salt);

    admin.resetPasswordToken = undefined;

    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
