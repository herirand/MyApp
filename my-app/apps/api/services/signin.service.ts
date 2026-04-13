import { prisma } from "@myapp/db";
import argon2 from "argon2";
import { FastifyRequest, FastifyReply } from "fastify";
import { AppError } from "../lib/errors";

async function signinService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { email, password } = request.body as {
			email: string,
			password: string,
		};

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email },
					{ username: email },
				],
			},
		});

		if (!existingUser) {
			throw new AppError("utilisateur non enregistrer", 404);
		}

		const verify = await argon2.verify(existingUser.password, password);
		if (!verify) {
			throw new AppError("mot de passe incorecte", 400);
		}

		const token = request.server.jwt.sign({
			id: existingUser.id,
			role: existingUser.role
		})

		return reply.code(201).send({
			success: true,
			token: token,
			role: existingUser.role,
			message: "connexion success"
		})
	} catch (error) {
		if (error instanceof AppError) {
			return reply.status(error.status).send({
				success: false,
				error: error.message,
			});
		} else {
			return reply.status(500).send({
				success: false,
				error: error ?? 'internal server error',
			});
		}
	}
}

export default signinService;
