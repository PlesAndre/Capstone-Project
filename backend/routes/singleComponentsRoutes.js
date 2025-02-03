import express from "express";
import {
  createComponent,
  deleteComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
} from "../queries/singleComponent.js";
import { cloudinary } from "../cloudinary/cloudinary.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getAllComponents);
router.get("/:id", getComponentById);
router.put("/:id", updateComponent);
router.delete("/:id", deleteComponent);
router.post("/new", createComponent);

router.post("/upload", upload.single("image"), function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  cloudinary.uploader
    .upload_stream((err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Errore durante il caricamento",
          error: err,
        });
      }

      // Risposta con il risultato di Cloudinary
      res.status(200).json({
        success: true,
        message: "Caricamento completato",
        data: result, // contiene l'URL dell'immagine e altri dati
      });
    })
    .end(req.file.buffer); // contiene il file in memoria
});

export { router };
