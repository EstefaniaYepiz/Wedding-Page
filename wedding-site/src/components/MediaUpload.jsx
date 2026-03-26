import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function MediaUpload() {
	const [uploading, setUploading] = useState(false);
	const [media, setMedia] = useState([]);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const closeLightbox = () => {
		setSelectedMedia(null);
		setSelectedIndex(null);
	};
	useEffect(() => {
		if (!selectedMedia) return;

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				closeLightbox();
			}

			if (e.key === "ArrowRight" && selectedIndex < media.length - 1) {
				const next = selectedIndex + 1;
				setSelectedIndex(next);
				setSelectedMedia(media[next]);
			}

			if (e.key === "ArrowLeft" && selectedIndex > 0) {
				const prev = selectedIndex - 1;
				setSelectedIndex(prev);
				setSelectedMedia(media[prev]);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedMedia, selectedIndex, media]);

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

		const files = data.map((file) => {
			const { data: publicUrlData } = supabase.storage
				.from("wedding-media")
				.getPublicUrl(file.name);

			const extension = file.name.split(".").pop()?.toLowerCase();

			const isVideo = ["mp4", "mov", "webm", "ogg"].includes(extension);

			return {
				name: file.name,
				url: publicUrlData.publicUrl,
				type: isVideo ? "video" : "image",
			};
		});

		setMedia(files);
	};
	useEffect(() => {
		if (selectedMedia) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedMedia]);

	const handleUpload = async (e) => {
		const files = Array.from(e.target.files);
		if (!files.length) return;

		setUploading(true);

		for (const file of files) {
			const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;

			const { error } = await supabase.storage
				.from("wedding-media")
				.upload(fileName, file);

			if (error) {
				console.error("Upload error:", error);
			}
		}

		await fetchMedia();

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
				{media.map((item, index) => (
					<div
						key={item.name}
						className={`gallery-item ${item.type === "video" ? "video-item" : ""}`}
						onClick={() => {
							setSelectedMedia(item);
							setSelectedIndex(index);
						}}
					>
						{item.type === "image" ? (
							<img src={item.url} alt="uploaded" />
						) : (
							<video src={item.url} muted playsInline />
						)}

						{item.type === "video" && (
							<span className="video-badge">Video</span>
						)}
					</div>
				))}
			</div>

			{selectedMedia &&
				createPortal(
					<div className="lightbox" onClick={closeLightbox}>
						<button
							className="lightbox-close"
							onClick={(e) => {
								e.stopPropagation();
								closeLightbox();
							}}
						>
							×
						</button>

						{selectedIndex > 0 && (
							<button
								className="lightbox-nav lightbox-prev"
								onClick={(e) => {
									e.stopPropagation();
									const prevIndex = selectedIndex - 1;
									setSelectedIndex(prevIndex);
									setSelectedMedia(media[prevIndex]);
								}}
							>
								‹
							</button>
						)}

						<div
							className="lightbox-content"
							onClick={(e) => e.stopPropagation()}
						>
							{selectedMedia.type === "image" ? (
								<img
									src={selectedMedia.url}
									alt="preview"
									className="lightbox-media"
								/>
							) : (
								<video
									src={selectedMedia.url}
									className="lightbox-media"
									controls
									autoPlay
								/>
							)}
						</div>

						{selectedIndex < media.length - 1 && (
							<button
								className="lightbox-nav lightbox-next"
								onClick={(e) => {
									e.stopPropagation();
									const nextIndex = selectedIndex + 1;
									setSelectedIndex(nextIndex);
									setSelectedMedia(media[nextIndex]);
								}}
							>
								›
							</button>
						)}
					</div>,
					document.body,
				)}
		</section>
	);
}

export default MediaUpload;
