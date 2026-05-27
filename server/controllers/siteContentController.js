import SiteContent from "../models/siteContentModel.js";

// GET CONTENT
export const getSiteContent = async (req, res) => {
  try {
    const content = await SiteContent.findOne({
      page: req.params.page,
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CONTENT
export const updateSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({
      page: req.params.page,
    });

    if (!content) {
      content = await SiteContent.create({
        page: req.params.page,
      });
    }

    Object.assign(content, req.body);

    const updated = await content.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
