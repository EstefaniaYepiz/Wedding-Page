import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function MediaUpload() {
	const [uploading, setUploading] = useState(false);
	const [media, setMedia] = useState([]);

	const fetchMedia = async () => {
		const { data, error } = await supabase.storage
			.from("wedding-media")
			.list("", {
				limit: 100,
				offset: 0,
			});

		if (error) {
			console.error(error);
			return;
		}

		console.log("FILES:", data);

		const files = data.map((file) => {
			const { data } = supabase.storage
				.from("wedding-media")
				.getPublicUrl(file.name);

			return data.publicUrl;
		});

		setMedia(files);
	};

	const handleUpload = async (e) => {
		const files = e.target.files;
		if (!files.length) return;

		setUploading(true);

		for (const file of files) {
			const fileName = `${Date.now()}-${Math.random()}-${file.name}`;

			const { error } = await supabase.storage
				.from("wedding-media")
				.upload(fileName, file);

			if (error) {
				console.error("Upload error:", error);
			}
		}

		alert("Upload complete");
		fetchMedia();

		setUploading(false);
		e.target.value = null;
	};

	useEffect(() => {
		fetchMedia();
	}, []);

	return (
		<section className="container upload">
			<h2 className="section-title">Comparte tus recuerdos</h2>

			<div className="upload-card">
				<p>Sube tus fotos o videos del evento</p>

				<label className="upload-label">
					Seleccionar fotos o videos
					<input
						type="file"
						accept="image/*,video/*"
						multiple
						onChange={handleUpload}
						disabled={uploading}
					/>
				</label>

				{uploading && <p>Subiendo recuerdos... 💕</p>}
			</div>

			<div className="gallery">
				{media.map((url, index) => (
					<img key={index} src={url} alt="uploaded" />
				))}
			</div>
		</section>
	);
}

export default MediaUpload;
