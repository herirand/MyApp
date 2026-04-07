import { FastifyRequest, FastifyReply } from "fastify";
import { TokenPayload } from "./auth.middleware";
import { request } from "http";

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decoded = await request.jwtVerify<TokenPayload>();
		if (decoded.role !== 'ADMIN')
			throw new Error("Admin only");
		request.user = decoded;
	} catch (error) {
		return reply.code(401).send({
			success: false,
			error: error ?? "admin only",
		});
	}
}
