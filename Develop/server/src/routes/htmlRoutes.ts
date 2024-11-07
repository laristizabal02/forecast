import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//console.log('hoooooolaaaa' +__dirname);
const router = Router();

// TODO: Define route to serve index.html
//const distDir = path.join(__dirname, '..', 'client', 'dist');  // Adjust path as needed


router.get('/', (req, res) => {
  console.log(req.query); 
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));  
  });
  
export default router;
