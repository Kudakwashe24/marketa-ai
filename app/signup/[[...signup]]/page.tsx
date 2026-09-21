import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-3 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 ai-grid opacity-40" />
      <div className="pointer-events-none absolute top-[-18rem] h-[36rem] w-[36rem] rounded-full bg-violet-600/20 blur-[130px]" />
      <div className="w-full max-w-md">
        <SignUp
          path="/signup"
          routing="path"
          signInUrl="/login"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorBackground: "#10121a",
              colorText: "#f8fafc",
              colorTextSecondary: "#94a3b8",
              colorPrimary: "#7c3aed",
              colorInputBackground: "#0b0d13",
              colorInputText: "#f8fafc",
            },
          }}
        />
      </div>
    </main>
  );
}
