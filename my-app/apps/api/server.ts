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

const app = Fastify({
	logger: true,
});

//cors
app.register(fastifyCors, {
	origin: [`${process.env.URL_FRONT}`, `${process.env.URL_SWAGGER}`],
	credentials: true,
	methods: ["GET", "POST", "DELETE", "PUT"],
});

app.register(fastifyJwt, {
	secret: `${process.env.JWT_SECRETS}`
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
		host: 'localhost:3001',
		schemes: ['http'],
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
//=================SWAGGER

app.register(authRoutes, { prefix: '/auth' });
app.register(transactionRoutes);
app.register(adminRoutes);

const start = async () => {
	try {
		const port = process.env.PORT;
		await app.listen({ port: parseInt(port || '3001'), host: '0.0.0.0' });
		console.log(`serveur runing in port : ${port || '3001'}`);
	} catch (err) {
		app.log.error(err);
		console.log(`serveur exiting`);
		process.exit(1);
	}
}

start();
