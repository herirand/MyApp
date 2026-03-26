import * as dotenv from "dotenv";
import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import fastifyCors from "@fastify/cors";

dotenv.config();

const app = Fastify({
	logger: true,
});

//cors
app.register(fastifyCors, {
	origin: 'localhost:3000',
	methods: ["GET", "POST", "DELETE", "PUT"],
	credentials: true,
});

//swagger config
app.register(fastifySwagger, {
	swagger: {
		info: {
			title: 'My-app',
			description: 'project perso',
			version: '1.0.0',
		},
		host: 'localhost:4000',
		schemes: ['http']
	}
});

app.register(fastifySwaggerUi, {
	routePrefix: '/api-docs'
});

const start = async () => {
	try {
		// const ports = process.env.PORT;
		await app.listen({ port: 4000, host: '0.0.0.0' });
		console.log(`app listening in port ${process.env.PORT}`);

	} catch (err) {
		console.log(`error: ${err}`);
		process.exit(1);
	}
}

start();
