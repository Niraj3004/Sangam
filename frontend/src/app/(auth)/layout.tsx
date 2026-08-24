import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] rounded-full -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20">
            S
          </div>
          <span className="text-3xl font-bold tracking-tight text-foreground">Sangam</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md w-full relative z-10">
        <div className="glass rounded-2xl p-8 shadow-xl shadow-slate-200/50">
          {children}
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted">
        &copy; {new Date().getFullYear()} Nepali Students Network.
      </div>
    </div>
  );
}
