import Link from "next/link";

/** Site-wide notice shown above the header. Edit the text here. */
const ANNOUNCEMENT = "Pre Order Available from 4th OCT";

export default function AnnouncementBar() {
  return (
    <Link href="/preorder" className="announcement-bar">
      <span className="announcement-bar__dot" aria-hidden />
      {ANNOUNCEMENT}
      <span aria-hidden>→</span>
    </Link>
  );
}
