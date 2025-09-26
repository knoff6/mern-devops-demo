import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/merndemo';
await mongoose.connect(MONGO_URL);

const Item = mongoose.model('Item', new mongoose.Schema({ name: String }));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/api/items', async (req, res) => res.json(await Item.find()));
app.post('/api/items', async (req, res) => res.status(201).json(await Item.create(req.body)));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));