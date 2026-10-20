/** Re-mounts on every navigation, so each page eases in instead of
 * snapping. The animation ends with no transform left on the wrapper, so
 * fixed-position modals inside pages are unaffected once it finishes. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-page-in motion-reduce:animate-none">{children}</div>
  );
}
