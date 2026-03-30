import { prisma } from "@myapp/db";
import argon2 from "argon2";

async function signinService(request, reply) {
	const { email, password } = request.body as {
		email: string,
		password: string,
	};
	console.log(`email or usename: ${email} | password: ${password}`);

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

	return reply.code(201).send({
		success: true,
		message: "connexion success"
	})
}

export default signinService;
