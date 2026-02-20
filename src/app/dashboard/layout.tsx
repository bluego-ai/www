import { auth, signOut } from "@/auth";
import { Providers } from "@/app/providers";
import { NavLink } from "@/components/NavLink";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <Providers>
      <div className="min-h-screen bg-gray-950">
        <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">
              <span className="text-blue-400">blue</span>
              <span className="text-white">go</span>
              <span className="text-blue-400/60">.ai</span>
            </h1>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300 font-medium">Fleet Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{session?.user?.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        
        <div className="flex">
          {/* Sidebar Navigation */}
          <nav className="w-64 border-r border-gray-800 bg-gray-900/30 min-h-[calc(100vh-73px)]">
            <div className="p-4 space-y-2">
              <NavLink href="/dashboard" label="Overview" />
              <NavLink href="/dashboard/messages" label="Message Feed" />
              <NavLink href="/dashboard/test-runner" label="Test Runner" />
              <NavLink href="/dashboard/leads" label="Leads" />
            </div>
          </nav>
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}