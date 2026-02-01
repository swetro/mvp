import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();

/**
 * Middleware to capture cookies from incoming requests
 */
app.use((req, res, next) => {
  const cookies = req.headers.cookie || '';
  (req as unknown as { angularCookies: string }).angularCookies = cookies;
  next();
});

const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  const cookiesToPass = (req as unknown as { angularCookies: string }).angularCookies || '';

  angularApp
    .handle(req, {
      providers: [
        {
          provide: 'REQUEST_COOKIES',
          useValue: cookiesToPass,
        },
      ],
    })
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
