import { FastifyInstance } from "fastify";
import { signupInputSchema, signinInputSchema } from "../dto/signup.dto";
import signupService from "../services/signup.service";
import signinService from "../services/signin.service";

function authRoutes(app: FastifyInstance) {
	app.post('/signup', signupInputSchema, signupService);
	app.post('/signin', signinInputSchema, signinService);
}

export default authRoutes;
