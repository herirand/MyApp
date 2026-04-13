import { prisma } from "@myapp/db";
import { FastifyReply, FastifyRequest } from "fastify";
import { isOnlyDigit, passWordHash } from "../utils/utils";
import { AppError } from "../lib/errors";

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
			throw new AppError("password don't match", 400);
		}

		if (!isOnlyDigit(id))
			throw new AppError("id doit etre que des entier", 400);

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email },
					{ userId: id },
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

		return reply.status(201).send({
			success: true,
			message: "user creared",
		});
	} catch (error) {
		if (error instanceof AppError) {
			return reply.status(error.status).send({
				success: false,
				error: error.message,
			})
		} else {
			return reply.status(500).send({
				success: false,
				error: error ?? 'internal server error',
			});
		}
	}
}

export default createUserService;
