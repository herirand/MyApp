import * as dotenv from "dotenv";
import Fastify from "fastify";
import path from "node:path";
import fastifySwagger from "@fastify/swagger"
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyCompress from "@fastify/compress";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import transactionRoutes from "./routes/students.routes";

dotenv.config();

const port = process.env.PORT || "3001";
const jwtSecret = process.env.JWT_SECRETS || (process.env.NODE_ENV !== "production" ? "dev-only-secret-change-me" : undefined);

if (!jwtSecret) {
	console.error("Missing JWT_SECRETS environment variable");
	process.exit(1);
}

const fallbackSwaggerUrl = `http://localhost:${port}`;
const swaggerUrl = process.env.URL_SWAGGER || fallbackSwaggerUrl;

let swaggerHost = `localhost:${port}`;
let swaggerScheme: "http" | "https" = "http";

try {
	const parsed = new URL(swaggerUrl);
	swaggerHost = parsed.host;
	swaggerScheme = parsed.protocol === "https:" ? "https" : "http";
} catch {
	// Keep local fallback values when URL_SWAGGER is invalid.
}

const allowedOrigins = [
	process.env.URL_FRONT,
	process.env.URL_SWAGGER,
	"http://localhost:3000",
	"http://127.0.0.1:3000",
].filter((value): value is string => Boolean(value));

const app = Fastify({
	logger: true,
});

//cors
app.register(fastifyCors, {
	origin: allowedOrigins,
	credentials: true,
	methods: ["GET", "POST", "DELETE", "PUT"],
});

app.register(fastifyJwt, {
	secret: jwtSecret,
})

// Compression: compress responses larger than 1KB
app.register(fastifyCompress, {
	threshold: 1024,
	encodings: ['gzip', 'deflate']
})

//swagger config
app.register(fastifySwagger, {
		swagger: {
			info: {
				title: 'My-app',
				description: 'project perso',
				version: '1.0.0',
			},
			host: swaggerHost,
			schemes: [swaggerScheme],
			securityDefinitions: {
				bearerAuth: {
				type: 'apiKey',
				name: 'Authorization',
				in: 'header',
				description: 'Format: Bearer <token>'
			}
		},
		security: [{ bearerAuth: [] }]
	}
});

app.register(fastifyStatic, {
	root: path.join(__dirname, '../../node_modules/@fastify/swagger-ui/static'),
	prefix: '/api-docs/static/',
	decorateReply: false,
});

app.get('/api-docs/json', async () => app.swagger());

app.get('/api-docs', async (_, reply) => {
	reply.type('text/html; charset=utf-8').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Swagger UI</title>
  <link rel="stylesheet" href="/api-docs/static/swagger-ui.css" />
  <link rel="stylesheet" href="/api-docs/static/index.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/api-docs/static/swagger-ui-bundle.js"></script>
  <script src="/api-docs/static/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset,
        ],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>`);
});

app.get('/api-docs/', async (_, reply) => {
	reply.redirect('/api-docs');
});

app.get('/', async () => ({
	status: 'ok',
	service: 'api',
}));

app.head('/', async (_, reply) => {
	reply.code(200).send();
});
//=================SWAGGER

app.register(authRoutes, { prefix: '/auth' });
app.register(transactionRoutes);
app.register(adminRoutes);

const start = async () => {
	try {
		await app.listen({ port: parseInt(port, 10), host: '0.0.0.0' });
		console.log(`serveur runing in port : ${port}`);
	} catch (err) {
		app.log.error(err);
		console.log(`serveur exiting`);
		process.exit(1);
	}
}

start();
