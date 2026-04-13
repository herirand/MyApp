import argon2 from "argon2";

export function passWordHash(password: string): any {
	const hashedPassword = argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 65536,
		timeCost: 3,
		parallelism: 4,
	})
	return hashedPassword;
}

export function isOnlyDigit(id: string): boolean {
	return /^\d+$/.test(id);
}
