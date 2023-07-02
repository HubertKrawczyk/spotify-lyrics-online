import Link from "next/link";

export default function NavigationMenu() {
  return (
    <div className="bg-black bg-opacity-90">
      <nav className="py-4">
        <ul className="flex flex-row gap-2">
          <li>
            <Link
              className="bg-slate-600 py-2 px-4 hover:bg-green-900"
              href="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="bg-slate-600 py-2 px-4 hover:bg-green-900"
              href="/logout"
            >
              Sign out
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
