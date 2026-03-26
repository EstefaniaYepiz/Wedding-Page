import invitationImg from "../assets/Invitation.png";
function Invitation() {
	return (
		<section className="container invitation-section fade-section">
			<div className="invitation-container">
				<img
					src={invitationImg}
					alt="Invitación"
					className="invitation-image"
				/>
			</div>
		</section>
	);
}
export default Invitation;
