declare module "url:*" {
	const url: string
	export default url
}

declare module "*.svg" {
	const component: React.StatelessComponent<React.SVGAttributes<SVGElement>>
	export default component
}