import * as dotenv from "dotenv";
import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = Fastify({
	logger: true,
});

//cors
app.register(fastifyCors, {
	origin: 'http://localhost:3000',
	credentials: true,
	methods: ["GET", "POST", "DELETE", "PUT"],
});

//swagger config
app.register(fastifySwagger, {
	swagger: {
		info: {
			title: 'My-app',
			description: 'project perso',
			version: '1.0.0',
		},
		host: 'localhost:3001',
		schemes: ['http']
	}
});

app.register(fastifySwaggerUi, {
	routePrefix: '/api-docs'
});

app.register(fastifyStatic, {
	root: '/'
});

app.register(authRoutes, { prefix: '/auth' });

const start = async () => {
	try {
		// const ports = process.env.PORT;
		await app.listen({ port: 3001, host: '0.0.0.0' });
		console.log(`app listening in port 3001`);

	} catch (err) {
		console.log(`error: ${err}`);
		process.exit(1);
	}
}

start();
