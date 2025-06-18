import { useEffect, useMemo, useRef } from 'react';

class Star {
  private orbitRadius: number;
  private radius: number;
  private orbitX: number;
  private orbitY: number;
  private timePassed: number;
  private speed: number;
  private alpha: number;

  private random(max: number): number;
  private random(min: number, max?: number): number;
  private random(min: number, max?: number): number {
    if (!max) {
      max = min;
      min = 0;
    }
    if (min > max) {
      var hold = max;
      max = min;
      min = hold;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private maxOrbit(x: number, y: number) {
    const diameter = Math.round(Math.sqrt(x * x + y * y));
    return diameter / 2;
  }

  constructor(public width: number, public height: number, public maxStars: number) {
    const random = this.random;
    const maxOrbit = this.maxOrbit;

    this.orbitRadius = random(maxOrbit(width, height));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = width / 2;
    this.orbitY = height / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 2000000;
    this.alpha = random(2, 10) / 10;
  }

  frame(ctx: CanvasRenderingContext2D, starCanvas: HTMLCanvasElement) {
    const random = this.random;
    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
    var y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
    var twinkle = random(20);

    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(starCanvas, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  }
}

export function StarrySky(props: {
  stars: number,
  width: number,
  height: number,
  hue: number
}) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const _stars = useRef<Star[]>([]);
  const hue = useRef<number>(props.hue);

  useEffect(() => {
    hue.current = props.hue;
  }, [props.hue]);

  useEffect(() => {
    _stars.current = [];
    if (!canvas) return;
    for (let i = 0; i < props.stars; i++) {
      _stars.current.push(new Star(props.width, props.height, props.stars));
    }
  }, [canvas, props.width, props.height, props.stars]);

  const starCanvas = useMemo(() => {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d')!;
    canvas.width = canvas.height = 100;
    var half = canvas.width / 2;
    var gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.025, '#fff');
    gradient.addColorStop(0.1, 'hsl(' + props.hue + ', 61%, 33%)');
    gradient.addColorStop(0.25, 'hsl(' + props.hue + ', 64%, 6%)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
  }, [props.hue]);

  useEffect(() => {
    const frame = () => {
      if (!canvas) return;
      const ctx = canvas.current?.getContext('2d')!;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'hsla(' + hue.current + ', 64%, 6%, 1)';
      ctx.fillRect(0, 0, canvas.current!.width, canvas.current!.height)
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < _stars.current.length; i++) {
        _stars.current[i].frame(ctx, starCanvas);
      };
      window.requestAnimationFrame(frame);
    };
    frame();
  }, [canvas]);

  return <canvas
    ref={canvas}
    width={props.width}
    height={props.height}
  >
  </canvas>;
}
