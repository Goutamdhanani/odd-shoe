import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'background-removal-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/remove-bg' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body);
                const base64Data = parsed.image.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');
                
                const inputPath = 'temp_in.png';
                const outputPath = 'temp_out.png';
                
                const fs = await import('fs/promises');
                await fs.writeFile(inputPath, buffer);
                
                const { exec } = await import('child_process');
                // Run python3 remove_bg.py to process background removal using rembg
                exec(`python3 remove_bg.py ${inputPath} ${outputPath}`, async (err, stdout, stderr) => {
                  if (err) {
                    console.error('rembg execution error:', err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: err.message }));
                    return;
                  }
                  try {
                    const outBuffer = await fs.readFile(outputPath);
                    const outBase64 = outBuffer.toString('base64');
                    
                    // Cleanup temp files
                    try {
                      await fs.unlink(inputPath);
                      await fs.unlink(outputPath);
                    } catch (e) {
                      console.warn('Temp cleanup failed:', e);
                    }
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ image: `data:image/png;base64,${outBase64}` }));
                  } catch (fsErr: any) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: fsErr.message }));
                  }
                });
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid request: ' + err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: true
  }
});
