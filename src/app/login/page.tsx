import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-blue-400">blue</span>
            <span className="text-white">go</span>
            <span className="text-blue-400/60">.ai</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">Fleet Monitoring Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
