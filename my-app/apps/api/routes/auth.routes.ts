import { FastifyInstance } from "fastify";
import { signupInputSchema, signinInputSchema } from "../dto/signup.dto";
import { forgotPasswordSchema } from "../dto/password.dto";
import signupService from "../services/signup.service";
import signinService from "../services/signin.service";
import forgotPasswordService from "../services/forgotPassword.service";

function authRoutes(app: FastifyInstance) {
	app.post('/signup', signupInputSchema, signupService);
	app.post('/signin', signinInputSchema, signinService);
	app.post('/forgot-password', forgotPasswordSchema, forgotPasswordService);
}

export default authRoutes;
