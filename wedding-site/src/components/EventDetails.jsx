function EventDetails() {
	return (
		<section className="container details">
			<h2 className="section-title">Detalles del Evento</h2>

			<div className="details-card">
				<p className="detail-date">12 de Septiembre, 2026</p>
				<p className="detail-time">5:00 PM</p>

				<div className="divider small" />

				<p className="detail-venue">Hotel </p>
				<p className="detail-address">
					Carretera <br />
					Somewhere
				</p>
			</div>
		</section>
	);
}

export default EventDetails;
