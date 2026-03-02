import invitationImg from "../assets/invitation.png";
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
