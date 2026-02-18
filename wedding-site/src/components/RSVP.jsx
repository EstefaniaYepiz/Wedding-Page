import { useState } from "react";
import { supabase } from "../lib/supabase";

function RSVP() {
	const [formData, setFormData] = useState({
		recipient: "",
		attendance: "",
		adults: 1,
		kids: 0,
		message: "",
	});

	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");

	function handleChange(e) {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (!formData.recipient || !formData.attendance) {
			setError("Por favor completa tu nombre y confirma asistencia.");
			return;
		}

		setError("");

		const { error } = await supabase.from("rsvps").insert([
			{
				recipient: formData.recipient,
				attendance: formData.attendance,
				adults: formData.adults,
				kids: formData.kids,
				message: formData.message,
			},
		]);

		if (error) {
			setError("Hubo un error. Intenta nuevamente.");
			return;
		}

		setSubmitted(true);
	}

	return (
		<section className="container rsvp">
			<h2 className="section-title">Confirma tu Asistencia</h2>

			<div className="rsvp-card">
				{error && <p className="error-message">{error}</p>}
				{submitted ? (
					<div className="thank-you-card reveal">
						<h3>Gracias por confirmar 🤍</h3>
						<p>Estamos muy felices de compartir este día contigo.</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="rsvp-form">
						<input
							type="text"
							name="recipient"
							placeholder="Nombre del invitado (Ej: Tía Esther)"
							value={formData.recipient}
							onChange={handleChange}
						/>

						<select
							name="attendance"
							value={formData.attendance}
							onChange={handleChange}
						>
							<option value="" disabled={formData.attendance !== ""}>
								¿Asistirás?
							</option>
							<option value="yes">Sí, asistiremos</option>
							<option value="no">No podremos asistir</option>
						</select>

						{formData.attendance === "yes" && (
							<div className="reveal">
								<div className="form-group">
									<p className="group-title">Adultos</p>

									<div className="counter">
										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													adults: Math.max(1, prev.adults - 1),
												}))
											}
										>
											−
										</button>

										<span key={formData.adults} className="count-number">
											{formData.adults}
										</span>

										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													adults: Math.min(2, prev.adults + 1),
												}))
											}
										>
											+
										</button>
									</div>
								</div>

								<div className="form-group">
									<p className="group-title">Niños</p>

									<div className="counter">
										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													kids: Math.max(0, prev.kids - 1),
												}))
											}
										>
											−
										</button>

										<span key={formData.kids} className="count-number">
											{formData.kids}
										</span>

										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													kids: Math.min(3, prev.kids + 1),
												}))
											}
										>
											+
										</button>
									</div>
								</div>
							</div>
						)}
						{formData.attendance && (
							<div className="reveal">
								<textarea
									name="message"
									placeholder="Mensaje para los novios (opcional)"
									value={formData.message}
									onChange={handleChange}
								/>
							</div>
						)}
						<button type="submit" className="rsvp-button">
							Enviar Confirmación
						</button>
					</form>
				)}
			</div>
		</section>
	);
}

export default RSVP;
