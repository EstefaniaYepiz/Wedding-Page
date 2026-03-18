function EventDetails() {
	const address = import.meta.env.VITE_ADDRESS;
	const location = import.meta.env.VITE_LOCATION;
	const date = import.meta.env.VITE_DATE;
	const time = import.meta.env.VITE_TIME;
	const mapUrl = import.meta.env.VITE_MAP_URL;
	const mapLink = import.meta.env.VITE_MAP_LINK;

	return (
		<section className="container details">
			<h2 className="section-title">Detalles del Evento</h2>

			<div className="details-card">
				<p className="detail-date">{date}</p>
				<p className="detail-time">{time}</p>

				<div className="divider small" />

				<p className="detail-venue">{location}</p>
				<p className="detail-address">{address}</p>
				<div className="map-container">
					<iframe
						src={mapUrl}
						width="100%"
						height="300"
						style={{ border: 0 }}
						allowFullScreen=""
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					></iframe>
				</div>
				<div className="divider small" />
				<a
					href={mapLink}
					target="_blank"
					rel="noopener noreferrer"
					className="map-button"
				>
					Ver en Google Maps
				</a>
			</div>
		</section>
	);
}

export default EventDetails;
