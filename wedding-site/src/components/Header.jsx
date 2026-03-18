import { useEffect } from "react";

function Header() {
	const names = import.meta.env.VITE_NAMES;
	const date = import.meta.env.VITE_DATE;
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
					<h1 className="names">{names}</h1>
					<div className="divider" />
					<p className="date">{date}</p>
					<div className="scroll-indicator">↓</div>
				</div>
			</div>
		</section>
	);
}

export default Header;
