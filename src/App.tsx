import "./App.css";
import Router from "./router/Router";
import { UserProvider } from "./contexts/UserContext";
import { Provider } from "react-redux";
import { store } from "./app/store";

const App = () => {
  return (
    <Provider store={store}>
      <UserProvider>
        <Router />
      </UserProvider>
    </Provider>
  );
};

export default App;
