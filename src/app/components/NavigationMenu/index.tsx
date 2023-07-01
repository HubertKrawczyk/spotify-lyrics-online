export default function NavigationMenu() {
  return (
    <nav className="py-4">
      <ul className="flex flex-row gap-2">
        <li>
          <a className="bg-slate-600 py-2 px-4 hover:bg-green-900" href="/">
            Home
          </a>
        </li>
        <li>
          <a
            className="bg-slate-600 py-2 px-4 hover:bg-green-900"
            href="/spotify-logout"
          >
            Sign out
          </a>
        </li>
      </ul>
    </nav>
  );
}
