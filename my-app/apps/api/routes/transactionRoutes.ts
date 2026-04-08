import { FastifyInstance } from "fastify";
import transactionStudentService from "../services/transactionStudentService";
import transactionAdminService from "../services/transactionAdminService";
import { transactionAdminDto, transactionStudentDto } from "../dto/transaction.dto";
import { authenticate } from "../middlwares/auth.middleware";
import { requireAdmin } from "../middlwares/admin.middleware";
// import { valideParams } from "../middlwares/dashboard.middlwares";


async function transactionRoutes(app: FastifyInstance) {
	app.get('/transactions/me', { ...transactionStudentDto, preHandler: authenticate }, transactionStudentService);
	app.post('/transactions', { ...transactionAdminDto, preHandler: requireAdmin }, transactionAdminService);
}

export default transactionRoutes;
