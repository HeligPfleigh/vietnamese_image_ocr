// import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { createWorker } from "tesseract.js";

const upload = multer({ dest: "./tmp" }).single("image");

const worker = createWorker({
  logger: (m) => console.log(m),
});

const handler = async (req: any, res: any) => {
  upload(req, res, async function (err: any) {
    if (err) {
      res.status(400);
    }

    try {
      await worker.load();
      await worker.loadLanguage("vie");
      await worker.initialize("vie");
      if (!req.file) {
        res.status(400);
      }
      const {
        data: { text },
      } = await worker.recognize(req.file.path);
      await worker.terminate();
      res.json({ message: text });
    } catch (error) {
      res.status(400);
    }
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
