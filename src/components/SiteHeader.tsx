import Link from "next/link";
import { currentUser } from "@/lib/session";
import { canModerate } from "@/lib/constants";
import { logoutAction } from "@/app/(auth)/actions";

export default async function SiteHeader() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white">
            V
          </span>
          <span className="text-lg">Vidalip</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm sm:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-ink-300 transition hover:bg-ink-800 hover:text-ink-100"
          >
            Browse
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-ink-300 transition hover:bg-ink-800 hover:text-ink-100"
            >
              My listings
            </Link>
          )}
          {canModerate(user?.role) && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-ink-300 transition hover:bg-ink-800 hover:text-ink-100"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard/account"
                className="hidden text-right sm:block rounded-lg px-2 py-1 transition hover:bg-ink-800"
              >
                <div className="text-sm font-medium leading-tight">{user.name}</div>
                <div className="text-xs leading-tight text-ink-400">
                  {user.role === "SUPER_ADMIN"
                    ? "Main admin"
                    : user.role === "ADMIN"
                      ? "Admin"
                      : "Member"}
                </div>
              </Link>
              <Link href="/dashboard/listings/new" className="btn-primary">
                Post a listing
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="btn-ghost">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
