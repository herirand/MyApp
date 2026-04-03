import * as dotenv from "dotenv";
import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import fastifyCors from "@fastify/cors";
import authRoutes from "./routes/authRoutes";
import fastifyJwt from "@fastify/jwt";
import transactionRoutes from "./routes/transactionRoutes";

dotenv.config();

const url = process.env.URL_FRONT;

const app = Fastify({
	logger: true,
});

//cors
app.register(fastifyCors, {
	origin: url,
	credentials: true,
	methods: ["GET", "POST", "DELETE", "PUT"],
});

app.register(fastifyJwt, {
	secret: "fastifyjwtpass"
})

//swagger config
app.register(fastifySwagger, {
	swagger: {
		info: {
			title: 'My-app',
			description: 'project perso',
			version: '1.0.0',
		},
		host: process.env.URL_SWAGGER,
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

app.register(fastifySwaggerUi, {
	routePrefix: '/api-docs'
});

// app.register(fastifyStatic, {
// 	root: '/'
// });

app.register(authRoutes, { prefix: '/auth' });
app.register(transactionRoutes);

const start = async () => {
	try {
		const port = process.env.PORT;
		await app.listen({ port: parseInt(port || '3001'), host: '0.0.0.0' });
	} catch (err) {
		process.exit(1);
	}
}

start();
