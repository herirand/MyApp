import { FastifyRequest } from "fastify";
import { TokenPayload } from "../middlwares/auth.middleware";

declare module "fastify" {
	interface FastifyRequest {
		user: TokenPayload;
	}
}
