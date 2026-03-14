/** Maps destination keywords to scenic Unsplash background URLs. */
const backgrounds: Record<string, string> = {
  tokyo:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80",
  kyoto:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80",
  japan:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
  france:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
  barcelona:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&q=80",
  spain:
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&q=80",
  rome:
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80",
  italy:
    "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1920&q=80",
  bali:
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
  indonesia:
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
  iceland:
    "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1920&q=80",
  morocco:
    "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920&q=80",
  london:
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80",
  "new york":
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80",
  portugal:
    "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=80",
  lisbon:
    "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=80",
  greece:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80",
  santorini:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80",
  thailand:
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80",
  bangkok:
    "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80",
  peru:
    "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1920&q=80",
  mexico:
    "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1920&q=80",
  australia:
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1920&q=80",
  sydney:
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80",
  "new zealand":
    "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
  dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80",
  argentina:
    "https://images.unsplash.com/photo-1531794302044-dbb28b1e9e40?w=1920&q=80",
  patagonia:
    "https://images.unsplash.com/photo-1531794302044-dbb28b1e9e40?w=1920&q=80",
};

const fallback =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80";

/**
 * Finds the best matching background image for a destination string.
 * Matches against known city/country keywords, falls back to a generic travel image.
 */
export function getDestinationBackground(destination: string): string {
  const lower = destination.toLowerCase();

  for (const [keyword, url] of Object.entries(backgrounds)) {
    if (lower.includes(keyword)) {
      return url;
    }
  }

  return fallback;
}
