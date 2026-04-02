import { fetchFromAPI } from './lib/api';

// Remplacez par le type réel retourné par votre backend
interface MyData {
	id: number;
	name: string;
	message: string;
}

export default async function HomePage() {
	// Appel direct à votre backend !
	// Si le backend n'est pas allumé, cela retournera une erreur.
	// Pensez à gérer les erreurs avec un fichier error.tsx plus tard.
	let data: MyData | null = null;
	let error = null;

	try {
		// Remplacez '/api/hello' par une vraie route de votre backend
		data = await fetchFromAPI('/api/hello', { cache: 'no-store' });
	} catch (err) {
		error = "Impossible de se connecter au backend.";
	}

	return (
		<div className="space-y-4">
			<h1 className="text-3xl font-bold">Bienvenue sur le Frontend</h1>

			<div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
				<h2 className="text-xl font-semibold mb-2">Statut du Backend :</h2>
				{error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<div>
						<p className="text-green-600 font-medium">Connecté avec succès !</p>
						<pre className="mt-2 bg-gray-200 dark:bg-gray-800 p-2 rounded text-sm">
							{JSON.stringify(data, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
