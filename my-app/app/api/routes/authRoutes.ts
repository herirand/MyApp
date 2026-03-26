import { FastifyInstance } from "fastify";
import { signupInputSchema } from "../schemas/signupSchemas";
import signupService from "../services/signupService";

function authRoutes(app: FastifyInstance) {
	app.post('/auth/signup', signupInputSchema, signupService);
}

export default authRoutes;
