import { useEffect, useState } from "react";

function Countdown() {
	const weddingDate = new Date("September 12, 2026 17:00:00").getTime();
	const [timeLeft, setTimeLeft] = useState({});

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const difference = weddingDate - now;

			if (difference > 0) {
				setTimeLeft({
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / (1000 * 60)) % 60),
				});
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<section className="container countdown fade-section">
			<h2 className="section-title">Faltan</h2>

			<div className="countdown-grid">
				<div>
					<span>{timeLeft.days || 0}</span>
					<p>Días</p>
				</div>
				<div>
					<span>{timeLeft.hours || 0}</span>
					<p>Horas</p>
				</div>
				<div>
					<span>{timeLeft.minutes || 0}</span>
					<p>Minutos</p>
				</div>
			</div>
		</section>
	);
}

export default Countdown;
