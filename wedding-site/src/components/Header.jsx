import { useEffect } from "react";

function Header() {
	useEffect(() => {
		const handleScroll = () => {
			const hero = document.querySelector(".hero");
			const offset = window.scrollY;
			hero.style.backgroundPositionY = offset * 0.5 + "px";
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<section className="hero">
			<div className="hero-overlay">
				<div className="hero-content">
					<h1 className="names">Richard & Estefanía</h1>
					<div className="divider" />
					<p className="date">12 de Septiembre, 2026</p>
					<div className="scroll-indicator">↓</div>
				</div>
			</div>
		</section>
	);
}

export default Header;
