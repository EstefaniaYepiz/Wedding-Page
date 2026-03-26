import { useEffect, useRef, useState } from "react";

function MusicPlayer() {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);

	const startMusic = async () => {
		if (!audioRef.current || hasStarted) return;

		try {
			await audioRef.current.play();
			setIsPlaying(true);
			setHasStarted(true);
		} catch (error) {
			console.error("Audio playback blocked:", error);
		}
	};

	const toggleMusic = async () => {
		if (!audioRef.current) return;

		try {
			if (isPlaying) {
				audioRef.current.pause();
				setIsPlaying(false);
			} else {
				await audioRef.current.play();
				setIsPlaying(true);
				setHasStarted(true);
			}
		} catch (error) {
			console.error("Audio playback blocked:", error);
		}
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.volume = 0.25;
		audio.loop = true;
	}, []);

	useEffect(() => {
		const handleFirstInteraction = () => {
			startMusic();
			window.removeEventListener("click", handleFirstInteraction);
			window.removeEventListener("touchstart", handleFirstInteraction);
		};

		window.addEventListener("click", handleFirstInteraction);
		window.addEventListener("touchstart", handleFirstInteraction);

		return () => {
			window.removeEventListener("click", handleFirstInteraction);
			window.removeEventListener("touchstart", handleFirstInteraction);
		};
	}, [hasStarted]);

	return (
		<>
			<audio ref={audioRef} src="/music.mp3" preload="auto" />

			<button
				className={`music-toggle ${isPlaying ? "playing" : ""}`}
				onClick={toggleMusic}
				aria-label="Reproducir música"
			>
				<>
					<div className="music-dot"></div>

					{isPlaying && (
						<div className="music-wave">
							<span></span>
							<span></span>
							<span></span>
						</div>
					)}
				</>
			</button>
		</>
	);
}

export default MusicPlayer;
