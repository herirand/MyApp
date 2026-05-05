import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../lib/errors";
import { prisma } from "@myapp/db";
import { passWordHash } from "../utils/utils";

async function forgotPasswordService(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { email, userId, newPassword, confirmPassword } = request.body as {
			email: string,
			userId: string,
			newPassword: string,
			confirmPassword: string,
		};

		if (newPassword !== confirmPassword) {
			throw new AppError("password don't match", 400);
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				AND: [
					{ email }, { userId },
				]
			},
		});

		if (!existingUser) {
			throw new AppError("bad request", 400);
		}

		const hashPass = await passWordHash(newPassword);

		await prisma.user.update({
			where: { id: existingUser.id },
			data: { password: hashPass },
		});

		return reply.code(201).send({
			success: true,
			message: "Password updated!",
		});

	} catch (error) {
		if (error instanceof AppError) {
			return reply.code(error.status).send({
				success: false,
				error: error.message,
			});
		}
		else {
			return reply.code(500).send({
				success: false,
				error: error ?? "Internal server error",
			});

		}
	}
}

export default forgotPasswordService;
