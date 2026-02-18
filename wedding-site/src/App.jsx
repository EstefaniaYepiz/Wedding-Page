import { Routes, Route } from "react-router-dom";
import WeddingPage from "./pages/WeddingPage";
import AdminPage from "./pages/AdminPage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<WeddingPage />} />
			<Route path="/admin" element={<AdminPage />} />
		</Routes>
	);
}

export default App;
