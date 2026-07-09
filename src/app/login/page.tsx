import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome!</h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to manage appointments and patients.
        </p>
      </div>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-sky-500 px-6 py-3 text-sm font-medium text-white transition-transform active:scale-95"
        >
          Continue with Google
        </button>
      </form>
    </main>
  );
}
