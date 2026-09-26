/**
 * StudioBackdrop — the fixed atmosphere layer: a technical grid, a vignette
 * and film grain. Deliberately free of decorative blobs.
 */
export default function StudioBackdrop() {
  return (
    <div className="st-backdrop" aria-hidden="true">
      <div className="st-backdrop-grid" />
      <div className="st-backdrop-vignette" />
      <div className="st-backdrop-grain" />
    </div>
  )
}
