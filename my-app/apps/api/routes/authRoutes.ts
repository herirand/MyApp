import { FastifyInstance } from "fastify";
import { signupInputSchema, signinInputSchema } from "../dto/signupSchemas";
import signupService from "../services/signupService";
import signinService from "../services/signinService";

function authRoutes(app: FastifyInstance) {
	app.post('/signup', signupInputSchema, signupService);
	app.post('/signin', signinInputSchema, signinService);
}

export default authRoutes;
