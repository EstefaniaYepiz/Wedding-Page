import { useEffect, useState } from "react";
import Header from "../components/Header";
import InvitationMessage from "../components/InvitationMessage";
import EventDetails from "../components/EventDetails";
import RSVP from "../components/RSVP";
import PhotoSection from "../components/PhotoSection";
import Countdown from "../components/Countdown";
import "../styles/global.css";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		return localStorage.getItem("wedding-auth") === "true";
	});

	const [passwordInput, setPasswordInput] = useState("");
	const [error, setError] = useState("");

	function handleLogin(e) {
		e.preventDefault();

		const correctPassword = import.meta.env.VITE_WEDDING_PASSWORD;

		if (passwordInput === correctPassword) {
			localStorage.setItem("wedding-auth", "true");
			setIsAuthenticated(true);
		} else {
			setError("Contraseña incorrecta");
		}
	}

	useEffect(() => {
		if (!isAuthenticated) return;

		const sections = document.querySelectorAll(".fade-section");

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
					}
				});
			},
			{ threshold: 0.2 },
		);

		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	}, [isAuthenticated]);

	if (!isAuthenticated) {
		return (
			<div className="password-screen">
				<form onSubmit={handleLogin} className="password-card">
					<h2>Richard & Estefanía</h2>
					<p>Ingresa la contraseña de tu invitación</p>

					<input
						type="password"
						value={passwordInput}
						onChange={(e) => setPasswordInput(e.target.value)}
						placeholder="Contraseña"
					/>

					{error && <p className="error-message">{error}</p>}

					<button type="submit" className="rsvp-button">
						Entrar
					</button>
				</form>
			</div>
		);
	}

	return (
		<>
			<Header />
			<div className="fade-section">
				<InvitationMessage />
			</div>

			<div className="fade-section">
				<Countdown />
			</div>

			<div className="fade-section">
				<EventDetails />
			</div>

			<div className="fade-section">
				<RSVP />
			</div>

			<div className="fade-section">
				<PhotoSection />
			</div>

			<button
				className="logout-btn"
				onClick={() => {
					localStorage.removeItem("wedding-auth");
					setIsAuthenticated(false);
				}}
			>
				Cambiar contraseña
			</button>
		</>
	);
}

export default App;
