'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
	email: string;
	username: string;
	id: string;
	password: string;
	confirmPassword: string;
}

interface ValidationErrors {
	email?: string;
	username?: string;
	password?: string;
	confirmPassword?: string;
	submit?: string;
}

export default function SignupPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		email: '',
		username: '',
		id: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [loading, setLoading] = useState(false);
	const [focused, setFocused] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	const validateField = (name: string, value: string): string | undefined => {
		switch (name) {
			case 'email':
				if (!value) return 'Email requis';
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalide';
				return undefined;
			case 'username':
				if (!value) return "Nom d'utilisateur requis";
				if (value.length < 3) return 'Minimum 3 caractères';
				if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Caractères alphanumériques uniquement';
				return undefined;
			case 'password':
				if (!value) return 'Mot de passe requis';
				if (value.length < 8) return 'Minimum 8 caractères';
				return undefined;
			case 'confirmPassword':
				if (!value) return 'Confirmation requise';
				if (value !== formData.password) return 'Les mots de passe ne correspondent pas';
				return undefined;
			default:
				return undefined;
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (errors[name as keyof ValidationErrors]) {
			setErrors({ ...errors, [name]: undefined });
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFocused(null);
		const error = validateField(name, value);
		if (error) {
			setErrors({ ...errors, [name]: error });
		}
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setSuccessMessage('');
		
		const newErrors: ValidationErrors = {};
		let hasErrors = false;
		
		(['email', 'username', 'password', 'confirmPassword'] as const).forEach((field) => {
			const error = validateField(field, formData[field]);
			if (error) {
				newErrors[field] = error;
				hasErrors = true;
			}
		});

		if (hasErrors) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: formData.email,
					username: formData.username,
					id: formData.id,
					password: formData.password,
					confirmPassword: formData.confirmPassword,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la création du compte');
			}

			setErrors({});
			setSuccessMessage('Compte cree avec succes ! Redirection vers la connexion...');
			setTimeout(() => {
				router.push('/login');
			}, 1200);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du compte';
			setErrors({ ...errors, submit: errorMessage });
		} finally {
			setLoading(false);
		}
	};

	const inputFields = [
		{ name: 'email', type: 'email', label: 'Email', placeholder: 'email@exemple.com', icon: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' },
		{ name: 'username', type: 'text', label: "Nom d'utilisateur", placeholder: 'username', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
		{ name: 'id', type: 'text', label: 'ID Étudiant', placeholder: 'Votre ID', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' },
		{ name: 'password', type: showPassword ? 'text' : 'password', label: 'Mot de passe', placeholder: 'Minimum 8 caractères', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
		{ name: 'confirmPassword', type: showPassword ? 'text' : 'password', label: 'Confirmer le mot de passe', placeholder: '••••••••', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
	];

	return (
		<div className="min-h-screen flex items-center justify-center app-shell-bg relative overflow-hidden py-4 px-3 sm:px-4 sm:py-8">
			<div className="absolute inset-0 app-shell-grid" />

			<div className="hidden md:block absolute top-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
			<div className="hidden md:block absolute bottom-20 left-20 w-96 bg-emerald-500/20 rounded-full blur-3xl" />

			<div className="relative z-10 w-full max-w-md px-1 sm:px-4">
				<div className="animate-fadeIn">
					<Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 md:mb-8 justify-center text-sm md:text-base">
						<svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Retour à l&apos;accueil
					</Link>
				</div>

				<div className="auth-card backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn stagger-1">
					<div className="text-center mb-6 sm:mb-8">
						<div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
							<svg className="w-7 sm:w-8 h-7 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
							</svg>
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold text-white">Créer un compte</h2>
						<p className="text-gray-400 mt-2 text-sm sm:text-base">Rejoignez-nous ! Remplissez le formulaire ci-dessous</p>
					</div>

					<form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
						{successMessage && (
							<div className="p-3 sm:p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center gap-3">
								<svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								{successMessage}
							</div>
						)}

						{errors.submit && (
							<div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center gap-3">
								<svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{errors.submit}
							</div>
						)}

						{inputFields.map((field) => (
							<div key={field.name} className="space-y-2">
								<label className="block text-sm font-medium text-gray-300">{field.label}</label>
								<div className={`relative transition-all duration-300 ${focused === field.name ? 'transform scale-[1.01]' : ''}`}>
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<svg className={`w-5 h-5 transition-colors ${focused === field.name ? 'text-cyan-300' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
										</svg>
									</div>
									<input
										type={field.type}
										name={field.name}
										required
										value={formData[field.name as keyof FormData]}
										onChange={handleChange}
										onFocus={() => setFocused(field.name)}
										onBlur={handleBlur}
										className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
											errors[field.name as keyof ValidationErrors] 
												? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
											: 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
										}`}
										placeholder={field.placeholder}
									/>
									{field.name === 'password' || field.name === 'confirmPassword' ? (
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
										>
											{showPassword ? (
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
												</svg>
											) : (
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											)}
										</button>
									) : null}
								</div>
								{errors[field.name as keyof ValidationErrors] && (
									<p className="text-red-400 text-xs mt-1 flex items-center gap-1">
										<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										{errors[field.name as keyof ValidationErrors]}
									</p>
								)}
							</div>
						))}

						<button 
							type="submit" 
							disabled={loading}
							className="w-full py-4 bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-sky-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/25 mt-2"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Création en cours...
								</span>
							) : "S'inscrire"}
						</button>
					</form>

					<p className="text-center mt-6 text-gray-400">
						Déjà un compte ?{' '}
						<Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors hover:underline">
							Se connecter
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
