/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	async headers() {
		return [
			{
				source: '/usports/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
		]
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				// destination: 'http://3.39.93.40:8080/api/:path*',
				destination: 'http://localhost:8080/api/:path*',
			},
		]
	},
	trailingSlash: true
};

export default nextConfig;