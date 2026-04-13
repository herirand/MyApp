import { prisma } from "@myapp/db";
import argon2 from "argon2";
import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../lib/errors";
import { passWordHash } from "../utils/utils";

async function newPasswordService(request: FastifyRequest, reply: FastifyReply) {
	try {

		const { currentPassword, newPassword, confirmPassword } = request.body as {
			currentPassword: string,
			newPassword: string,
			confirmPassword: string,
		}

		if (newPassword != confirmPassword) {
			throw new AppError("password don't match", 400);
		}

		const userId: number = Number(request.user.id);
		const existingUser = await prisma.user.findUnique({
			where: { id: userId }
		});

		if (!existingUser) {
			throw new AppError('utilisateur non trouver', 404);
		}

		const verify = await argon2.verify(existingUser.password, currentPassword);
		if (!verify) {
			throw new AppError('mot de pass incorecte', 400);
		}

		const pass = await passWordHash(newPassword);
		await prisma.user.update({
			where: { id: existingUser.id },
			data: { password: pass }
		})

		return reply.status(200).send({
			success: true,
			message: 'mot de pass changer avec succes',
		});
	} catch (error) {
		if (error instanceof AppError) {
			return reply.status(error.status).send({ success: false, error: error.message });
		} else {
			return reply.status(500).send({
				success: false,
				error: error ?? 'serveur error',
			})
		}
	}
}

export default newPasswordService;
