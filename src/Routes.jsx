import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateForm from "./pages/FormCreationPage/CreateForm";
import FormListing from "./pages/FormListingPage/FormListing";
import FormResponse from "./pages/FormResponsePage/FormResponse";
import FormBuilder from "./pages/QuestionTypes/FormBuilder";

const routes = [
	{
		url: "/",
		component: FormListing,
	},
	{
		url: "/create-form",
		component: FormBuilder,
	},
	{
		url: "/form-response/:id",
		component: FormResponse,
	},
];

const ReactRoutes = ({ history }) => {
	return (
		<>
			{
				<BrowserRouter history={history}>
					<Routes>
						{routes.map((route, index) => {
							return <Route element={<route.component />} path={route.url} key={index} />;
						})}
					</Routes>
				</BrowserRouter>
			}
		</>
	);
};

export default ReactRoutes;
