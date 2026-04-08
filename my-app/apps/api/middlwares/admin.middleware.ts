import { FastifyRequest, FastifyReply } from "fastify";
import { TokenPayload } from "./auth.middleware";

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decoded = await request.jwtVerify<TokenPayload>();
		if (decoded.role !== 'ADMIN') {
			return reply.status(401).send({
				success: false,
				error: 'admin only',
			})
		}
		request.user = decoded;
	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: error ?? "admin only",
		});
	}
}
