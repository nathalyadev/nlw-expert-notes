import {
  BrowserRouter,
  Routes as Switch,
  Route,
  Navigate,
} from "react-router-dom";
import { Notes } from "../pages";

export function Routes() {
  return (
    <BrowserRouter basename={"/nlw_expert_notes"}>
      <Switch>
        <Route
          path={"/notes"}
          element={<Notes />}
        />

        <Route
          path="/*"
          element={
            <Navigate to="/notes" />
          }
        />
      </Switch>
    </BrowserRouter>
  );
}
