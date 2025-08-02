const Footer = () => {
	const currYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-800 border-t border-gray-700 py-4">
			<div className="container-app">
				<p className="text-sm text-gray-400 text-center">
					DevBills {currYear} - Desenvolvido por{" "}
					<span className="font-bold text-primary-500">Douglas Oliveira</span>{" "}
					com <strong>TypeScript</strong> & <strong>React</strong>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
