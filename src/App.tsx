import AppRouter from "./app/AppRouter";
import UserSessionProvider from "./app/UserSessionProvider";

function App() {
  return (
    <UserSessionProvider>
      <AppRouter />
    </UserSessionProvider>
  );
}

export default App;
