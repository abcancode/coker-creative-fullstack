import Testimonial from "../models/testimonialModel.js";

// GET TESTIMONIALS
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      active: true,
    });

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE TESTIMONIAL
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TESTIMONIAL
export const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);

    res.json({
      message: "Testimonial deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
