import { prisma } from "@myapp/db";
import { FastifyInstance } from "fastify";
import transactionStudentService from "../services/transactionStudentService";
import transactionAdminService from "../services/transactionAdminService";
import { transactionAdminDto, transactionStudentDto } from "../dto/transaction.dto";
// import { valideParams } from "../middlwares/dashboard.middlwares";


async function transactionRoutes(app: FastifyInstance) {
	app.get('/transactions/me', transactionStudentDto, transactionStudentService);
	app.post('/transactions', transactionAdminDto, transactionAdminService);
}

export default transactionRoutes;
