// /types/colorthief.d.ts
declare module "colorther" {
  interface ColorThief {
    getColor(image: HTMLImageElement | string, quality?: number): number[];
    getPalette(image: HTMLImageElement | string, colorCount?: number, quality?: number): number[][];
  }

  const ColorThief: {
    new (): ColorThief;
  };

  export default ColorThief;
}