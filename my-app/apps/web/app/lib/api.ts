const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
	const url = `${API_BASE_URL}${endpoint}`;

	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
