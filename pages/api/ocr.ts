import { NextApiRequest, NextApiResponse } from "next";
import { createWorker } from "tesseract.js";

const worker = createWorker({
  logger: (m) => console.log(m),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await worker.load();
    await worker.loadLanguage("vie");
    await worker.loadLanguage("en");
    await worker.initialize("vie");
    const { image } = req.body;
    console.log(req.body);
    const {
      data: { text },
    } = await worker.recognize(image);
    res.json({ message: text });
  } catch (error) {
    res.status(400);
  }
};

export const config = {
  api: {
    bodyParser: true,
  },
};

export default handler;
