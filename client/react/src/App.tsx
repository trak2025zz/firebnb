import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./libs/feature-data-access-api/auth";
import { AuthenticatedApp } from "./libs/feature-shell/authenticated-app/authenticated-app";
import { UnauthenticatedApp } from "./libs/feature-shell/unauthenticated-app/unauthenticated-app";

const FireBnbApps = () => {
  const { data, isLoading } = useUser();

  if (isLoading) return;

  if (!data) return <UnauthenticatedApp />;

  return <AuthenticatedApp />;
};

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-center" autoClose={2500} />
      <FireBnbApps />
    </QueryClientProvider>
  );
};
