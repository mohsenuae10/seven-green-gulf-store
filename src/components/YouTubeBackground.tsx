import { getYouTubeBackgroundEmbedUrl } from "@/lib/youtube";

interface YouTubeBackgroundProps {
  url: string;
}

/**
 * Renders a muted, looping, chrome-less YouTube embed that fully covers its
 * (relatively positioned) parent — same visual role as a <video object-fit:cover>,
 * which the YouTube iframe can't do on its own since object-fit doesn't apply to iframes.
 * The iframe is over-sized based on the source's 16:9 ratio and centered, using
 * container query units so it scales to the parent regardless of the parent's own
 * aspect ratio (no letterboxing).
 */
export function YouTubeBackground({ url }: YouTubeBackgroundProps) {
  const embedUrl = getYouTubeBackgroundEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ containerType: "size" }}
    >
      <iframe
        src={embedUrl}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          border: 0,
          width: "max(100cqw, 177.78cqh)",
          height: "max(100cqh, 56.25cqw)",
        }}
        allow="autoplay; encrypted-media; picture-in-picture"
        title="Banner video"
      />
    </div>
  );
}
