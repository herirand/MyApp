import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";
import { passWordHash } from "../utils/utils";

async function createUserService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { email, username, id, password, confirmPassword } = request.body as {
			email: string;
			username: string;
			id: string;
			password: string;
			confirmPassword: string;
		};

		if (password != confirmPassword) {
			return reply.status(400).send({
				success: false,
				error: "password don't match",
			});
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email },
					{ userId: id },
				]
			},
		});

		if (existingUser) {
			return reply.status(409).send({
				success: false,
				error: "email ou id deja utiliser",
			});
		}

		const pass = await passWordHash(password);

		const user = await prisma.user.create({
			data: {
				email, username, userId: id, password: pass
			},
			select: {
				email: true, username: true, role: true
			}
		})

		return reply.status(201).send({
			success: true,
			message: "user creared",
		});
	} catch (error) {
		return reply.status(400).send({
			success: false,
			error: error ?? 'erreur lors de la creation de l\'user',
		});
	}
}

export default createUserService;
