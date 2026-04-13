import { prisma } from "@myapp/db"
import { passWordHash } from "../utils/utils";
import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../lib/errors";

async function signupService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { email, username, id, password, confirmPassword } = request.body as {
			email: string,
			username: string,
			id: string,
			password: string,
			confirmPassword: string,
		};

		if (password != confirmPassword) {
			throw new AppError("password don't match", 400);
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email },
					{ userId: id }
				]
			},
		});

		if (existingUser) {
			throw new AppError("email ou id deja utiliser", 409);
		}
		const pass = await passWordHash(password);

		const user = await prisma.user.create({
			data: {
				email, username, userId: id, password: pass, role: 'STUDENT'
			},
			select: {
				email: true, username: true, role: true
			}
		})

		return reply.code(201).send({
			success: true,
			message: "user ariver "
		});
	} catch (error) {
		if (error instanceof AppError) {
			return reply.status(error.status).send({
				success: false,
				error: error.message,
			});
		} else {
			return reply.status(400).send({
				success: false,
				error: error ?? 'serveur error',
			});
		}
	}
}

export default signupService;
