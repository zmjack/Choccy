import { useEffect } from "react";

export function WindowEvent(props: {
  onResize: (ev: UIEvent) => any
}) {
  useEffect(() => {
    window.addEventListener('resize', props.onResize);
    return () => {
      window.removeEventListener('resize', props.onResize);
    };
  }, []);
  return <></>;
}