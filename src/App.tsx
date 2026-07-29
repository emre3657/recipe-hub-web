import AppRouter from "./app/AppRouter";
import ToastProvider from "./app/ToastProvider";
import UserSessionProvider from "./app/UserSessionProvider";

function App() {
  return (
    <ToastProvider>
      <UserSessionProvider>
        <AppRouter />
      </UserSessionProvider>
    </ToastProvider>
  );
}

export default App;
