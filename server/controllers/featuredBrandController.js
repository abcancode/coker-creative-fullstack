import FeaturedBrand from "../models/featuredBrandModel.js";

// GET ALL BRANDS
export const getBrands = async (req, res) => {
  try {
    const brands = await FeaturedBrand.find({
      active: true,
    });

    res.json(brands);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE BRAND
export const createBrand = async (req, res) => {
  try {
    const brand = await FeaturedBrand.create(req.body);

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE BRAND
export const deleteBrand = async (req, res) => {
  try {
    await FeaturedBrand.findByIdAndDelete(req.params.id);

    res.json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
