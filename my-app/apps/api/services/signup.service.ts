import { prisma } from "@myapp/db"
import { passWordHash } from "../utils/utils";
import { FastifyRequest, FastifyReply } from "fastify";

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
			return reply.code(400).send({
				success: false,
				error: "password don't match",
			})
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
			return reply.code(409).send({
				success: false,
				error: "email ou id deja utiliser",
			});
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
		return reply.status(400).send({
			success: false,
			error: error ?? 'erreur lors de la creation de l\'user',
		});
	}
}

export default signupService;
