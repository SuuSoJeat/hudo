import * as React from "react";

/**
 * A hook that tracks the state of a media query.
 * @param query - The media query string to evaluate
 * @returns A boolean indicating whether the media query matches
 *
 * @example
 * // Check if the screen is at least 768px wide (typical desktop breakpoint)
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
