declare module "*.svg" {
	const component: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
	export default component;
}