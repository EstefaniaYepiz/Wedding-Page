import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function AdminPage() {
	const [showModal, setShowModal] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [toast, setToast] = useState("");
	const [deletingRowId, setDeletingRowId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState("created_at");
	const [sortDirection, setSortDirection] = useState("desc");
	const [darkMode, setDarkMode] = useState(false);

	const [isAdmin, setIsAdmin] = useState(() => {
		return localStorage.getItem("admin-auth") === "true";
	});

	const [passwordInput, setPasswordInput] = useState("");
	const [error, setError] = useState("");
	const [rsvps, setRsvps] = useState([]);
	const [loading, setLoading] = useState(true);

	function handleLogin(e) {
		e.preventDefault();
		const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

		if (passwordInput === correctPassword) {
			localStorage.setItem("admin-auth", "true");
			setIsAdmin(true);
		} else {
			setError("Contraseña incorrecta");
		}
	}
	function handleSort(field) {
		if (sortField === field) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	}

	function exportToCSV() {
		if (rsvps.length === 0) return;

		const headers = [
			"Nombre",
			"Asistencia",
			"Adultos",
			"Niños",
			"Mensaje",
			"Fecha",
		];

		const rows = rsvps.map((r) => [
			r.recipient,
			r.attendance,
			r.adults,
			r.kids,
			r.message,
			new Date(r.created_at).toLocaleString(),
		]);

		const csvContent = [headers, ...rows]
			.map((row) => row.map((field) => `"${field ?? ""}"`).join(","))
			.join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute("download", "wedding_rsvps.csv");
		link.click();
	}
	function openDeleteModal(id) {
		setSelectedId(id);
		setShowModal(true);
	}

	async function confirmDelete() {
		if (!selectedId) return;

		setIsDeleting(true);

		const { error } = await supabase
			.from("rsvps")
			.delete()
			.eq("id", selectedId);

		if (error) {
			console.error(error.message);
		} else {
			setDeletingRowId(selectedId);

			setTimeout(() => {
				setRsvps((prev) => prev.filter((r) => r.id !== selectedId));
				setDeletingRowId(null);
			}, 300);

			showToast("RSVP eliminado correctamente");
		}

		setIsDeleting(false);
		setShowModal(false);
		setSelectedId(null);
	}

	function showToast(message) {
		setToast(message);
		setTimeout(() => setToast(""), 3000);
	}

	useEffect(() => {
		if (!isAdmin) return;

		let channel;

		async function fetchData() {
			const { data, error } = await supabase
				.from("rsvps")
				.select("*")
				.order("created_at", { ascending: false });

			if (!error) {
				setRsvps(data);
			}

			setLoading(false);
		}

		fetchData();

		channel = supabase
			.channel("rsvps-realtime")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "rsvps",
				},
				(payload) => {
					console.log("New RSVP received:", payload);
					fetchData();
				},
			)
			.subscribe((status) => {
				console.log("Realtime status:", status);
			});

		return () => {
			if (channel) {
				supabase.removeChannel(channel);
			}
		};
	}, [isAdmin]);

	useEffect(() => {
		function handleEsc(e) {
			if (e.key === "Escape") {
				setShowModal(false);
			}
		}

		if (showModal) {
			window.addEventListener("keydown", handleEsc);
		}

		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [showModal]);

	if (!isAdmin) {
		return (
			<div className="password-screen">
				<form onSubmit={handleLogin} className="password-card">
					<h2>Admin Access</h2>

					<input
						type="password"
						placeholder="Admin password"
						value={passwordInput}
						onChange={(e) => setPasswordInput(e.target.value)}
					/>

					{error && <p className="error-message">{error}</p>}

					<button type="submit">Enter</button>
				</form>
			</div>
		);
	}
	const totalAttendingGuests = rsvps
		.filter((r) => r.attendance === "yes")
		.reduce((sum, r) => sum + (r.adults || 0) + (r.kids || 0), 0);

	const totalAdults = rsvps
		.filter((r) => r.attendance === "yes")
		.reduce((sum, r) => sum + (r.adults || 0), 0);

	const totalKids = rsvps
		.filter((r) => r.attendance === "yes")
		.reduce((sum, r) => sum + (r.kids || 0), 0);

	const totalDeclined = rsvps.filter((r) => r.attendance === "no").length;
	const filteredRsvps = rsvps.filter((r) =>
		r.recipient.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const sortedRsvps = [...filteredRsvps].sort((a, b) => {
		let aValue = a[sortField];
		let bValue = b[sortField];

		if (sortField === "created_at") {
			aValue = new Date(aValue);
			bValue = new Date(bValue);
		}

		if (aValue < bValue) {
			return sortDirection === "asc" ? -1 : 1;
		}
		if (aValue > bValue) {
			return sortDirection === "asc" ? 1 : -1;
		}
		return 0;
	});
	return (
		<div className={`admin-container ${darkMode ? "dark" : ""}`}>
			<h1 className="admin-title">Panel Administrativo</h1>
			<button
				className="dark-toggle"
				onClick={() => setDarkMode((prev) => !prev)}
			>
				{darkMode ? "Light Mode" : "Dark Mode"}
			</button>

			<div className="admin-cards">
				<div className="admin-card">
					<h3>RSVP Totales</h3>
					<p>{rsvps.length}</p>
				</div>

				<div className="admin-card">
					<h3>Confirmados</h3>
					<p>{totalAttendingGuests}</p>
				</div>

				<div className="admin-card">
					<h3>Adultos</h3>
					<p>{totalAdults}</p>
				</div>

				<div className="admin-card">
					<h3>Niños</h3>
					<p>{totalKids}</p>
				</div>

				<div className="admin-card">
					<h3>No Asisten</h3>
					<p>{totalDeclined}</p>
				</div>
				<div className="mini-chart">
					<div
						className="slice attending"
						style={{
							width: `${(totalAttendingGuests / (totalAttendingGuests + totalDeclined || 1)) * 100}%`,
						}}
					></div>
				</div>
			</div>
			<button className="export-btn" onClick={exportToCSV}>
				⬇ Export CSV
			</button>

			<div className="admin-table-wrapper">
				<input
					type="text"
					placeholder="Buscar por nombre..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="search-input"
				/>

				{loading ? (
					<p>Loading...</p>
				) : (
					<table className="admin-table">
						<thead>
							<tr>
								<th onClick={() => handleSort("recipient")}>Nombre</th>
								<th>Asistencia</th>
								<th>Adultos</th>
								<th>Niños</th>
								<th>Mensaje</th>
								<th onClick={() => handleSort("created_at")}>Fecha</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{sortedRsvps.map((rsvp) => (
								<tr
									key={rsvp.id}
									className={deletingRowId === rsvp.id ? "row-fade-out" : ""}
								>
									<td>{rsvp.recipient}</td>
									<td>{rsvp.attendance}</td>
									<td>{rsvp.adults}</td>
									<td>{rsvp.kids}</td>
									<td>{rsvp.message}</td>
									<td>{new Date(rsvp.created_at).toLocaleDateString()}</td>
									<td>
										<button
											className="delete-pill"
											onClick={() => openDeleteModal(rsvp.id)}
										>
											Eliminar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
			{showModal && (
				<div
					className="modal-overlay fade-in"
					onClick={() => setShowModal(false)}
				>
					<div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
						<h3>Confirmar eliminación</h3>
						<p>¿Estás segura de que quieres eliminar este RSVP?</p>

						<div className="modal-actions">
							<button
								className="modal-cancel"
								onClick={() => setShowModal(false)}
								disabled={isDeleting}
							>
								Cancelar
							</button>

							<button
								className="modal-delete"
								onClick={confirmDelete}
								disabled={isDeleting}
							>
								{isDeleting ? "Eliminando..." : "Eliminar"}
							</button>
						</div>
					</div>
				</div>
			)}
			{toast && <div className="toast">{toast}</div>}

			<button
				className="logout-btn"
				onClick={() => {
					localStorage.removeItem("admin-auth");
					setIsAdmin(false);
				}}
			>
				Cerrar sesión
			</button>
		</div>
	);
}

export default AdminPage;
