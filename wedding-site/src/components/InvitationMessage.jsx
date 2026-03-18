function InvitationMessage() {
	const message1 = import.meta.env.VITE_INTRO_MESSAGE_TOP;
	const message2 = import.meta.env.VITE_INTRO_MESSAGE_BOTTOM;
	return (
		<section className="container invitation">
			<p>
				{message1} <br />
				{message2}
			</p>
		</section>
	);
}

export default InvitationMessage;
