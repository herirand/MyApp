import { FastifyInstance } from "fastify";
import { signupInputSchema } from "../dto/signupSchemas";
import signupService from "../services/signupService";

function authRoutes(app: FastifyInstance) {
	app.post('/signup', signupInputSchema, signupService);
}

export default authRoutes;
