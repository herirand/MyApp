import { prisma } from "@myapp/db";
import { FastifyInstance } from "fastify";
import transactionStudentService from "../services/transactionStudentService";
import transactionAdminService from "../services/transactionAdminService";
// import { valideParams } from "../middlwares/dashboard.middlwares";


async function transactionRoutes(app: FastifyInstance) {
	app.get('/transactions/me', transactionStudentService);
	app.post('/transactions', transactionAdminService);
}

export default transactionRoutes;
