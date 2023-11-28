import express, { Express } from "express";
import morgan from "morgan";

const app: Express = express();
const PORT = 3001;
app.use(express.json());
app.use(morgan("dev"));

app.post("/data", (req, res) => {
  const formData = req.body;

  if (Object.keys(formData).length < 1) {
    res.status(400).json({ msg: "Form data required!" });

    return;
  }
  res.json({ payload: formData });
});

app.get("/", (req, res) => {
  res.json({ msg: "Hello world!" });
});

app.listen(PORT, () => console.log(`Running at port :${PORT}`));
