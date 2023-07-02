import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto py-6 bg-gray-900 text-center text-base">
      Spotify Lyrics Online 2023
      <br />
      <Link href="https://github.com/HubertKrawczyk/spotify-lyrics-online" className="underline text-green-700 hover:text-green-300">GitHub</Link>
    </footer>
  );
}
