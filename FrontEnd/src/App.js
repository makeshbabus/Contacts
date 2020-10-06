/** ****************************** Import Packages *************************** */
import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

/********************************* Import Components ************************* */
import AppRoutes from "../src/AppRoutes";

/********************************* Import Style ************************* */
// import "../public/style.css";
// import "../public/default-style.css";

/********************************* Import Utils ****************************** */
import interceptors from "./axiosInterceptor";

class App extends Component {
	render() {
		return (
			<BrowserRouter>
						<div className="App">
							<AppRoutes />
						</div>
			</BrowserRouter>
		);
	}
}

export default App;
