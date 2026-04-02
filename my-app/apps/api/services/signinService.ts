import { prisma } from "@myapp/db";
import argon2 from "argon2";
import { FastifyRequest, FastifyReply } from "fastify";

async function signinService(request: FastifyRequest, reply: FastifyReply) {
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
		return reply.code(401).send({
			success: false,
			error: "user pas enregistrer",
		})
	}

	const verify = await argon2.verify(existingUser.password, password);
	if (!verify) {
		return reply.code(401).send({
			success: false,
			error: "mot de passe incorecte",
		})
	}

	const token = await request.server.jwt.sign({
		id: existingUser.id,
		role: existingUser.role
	})

	return reply.code(201).send({
		success: true,
		token: token,
		role: existingUser.role,
		message: "connexion success"
	})
}

export default signinService;
