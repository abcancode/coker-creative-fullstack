import Recognition from "../models/recognitionModel.js";

// GET
export const getRecognitions = async (req, res) => {
  try {
    const recognitions = await Recognition.find({
      active: true,
    });

    res.json(recognitions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE
export const createRecognition = async (req, res) => {
  try {
    const recognition = await Recognition.create(req.body);

    res.status(201).json(recognition);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE
export const deleteRecognition = async (req, res) => {
  try {
    await Recognition.findByIdAndDelete(req.params.id);

    res.json({
      message: "Recognition deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
