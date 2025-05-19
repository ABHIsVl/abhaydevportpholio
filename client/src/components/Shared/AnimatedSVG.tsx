import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type AnimatedSVGProps = {
  svgPath: string;
  width?: string;
  height?: string;
  color?: string;
  animation?: 'pulse' | 'rotate' | 'float';
  duration?: number;
};

export default function AnimatedSVG({
  svgPath,
  width = 'w-12',
  height = 'h-12',
  color = 'text-accent',
  animation = 'pulse',
  duration = 2
}: AnimatedSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const tl = gsap.timeline({ repeat: -1 });

      switch (animation) {
        case 'pulse':
          tl.to(svgRef.current, { scale: 1.1, duration: duration / 2, ease: 'power1.inOut' })
            .to(svgRef.current, { scale: 1, duration: duration / 2, ease: 'power1.inOut' });
          break;
        case 'rotate':
          tl.to(svgRef.current, { rotation: 360, duration, ease: 'linear' });
          break;
        case 'float':
          tl.to(svgRef.current, { y: -10, duration: duration / 2, ease: 'power1.inOut' })
            .to(svgRef.current, { y: 0, duration: duration / 2, ease: 'power1.inOut' });
          break;
      }
    }
  }, [animation, duration]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      className={`${width} ${height} ${color}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={svgPath} />
    </svg>
  );
}
