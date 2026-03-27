import { useState } from "react";

const faqItems = [
	{
		question: "¿Hay código de vestimenta?",
		answer:
			"No hay un código de vestimenta específico, pero sugerimos playa formal o semiformal (Beach formal / Beach semiformal) ya que la ceremonia será al aire libre en la playa y la recepción en un jardín con vista al mar. Solo les pedimos no usar blanco, ya que es el color de la novia.",
	},
	{
		question: "¿Puedo llevar acompañante?",
		answer:
			"Sí, cada invitación es para dos personas. Si deseas llevar otro acompañante, por favor contáctanos para verificar la disponibilidad.",
	},
	{
		question: "¿Habrá niños en el evento?",
		answer: "Sí, podrán asistir niños bajo previa confirmación.",
	},
	{
		question: "¿Hasta cuándo puedo confirmar mi asistencia?",
		answer:
			"Favor de confirmar antes del 12 de agosto de 2026. En esa fecha se cerrará el registro y ya no será posible incluir a más asistentes.",
	},
	{
		question: "Detalles del hotel",
		answer:
			"El hotel Castillos del mar contará con una tarifa especial para nuestros invitados. Si desean hacer uso de esa tarifa, pueden mencionar el evento al momento de hacer su reservación. El evento será en el hotel sin embargo, pueden elegir el alojamiento de su preferencia y acompañarnos al evento.",
	},
];

function FAQ() {
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="container faq-section">
			<h2 className="section-title">Preguntas Frecuentes</h2>

			<div className="faq-list">
				{faqItems.map((item, index) => (
					<div key={index} className="faq-item">
						<button className="faq-question" onClick={() => toggleFAQ(index)}>
							<span>{item.question}</span>
							<span className={`faq-icon ${openIndex === index ? "open" : ""}`}>
								+
							</span>
						</button>

						<div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
							<p>{item.answer}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default FAQ;
