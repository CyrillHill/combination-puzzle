export default interface Game {
  itemCount: number;
  colorCount: number;
  items: any[],
  isFirstStep: boolean;
  currentItem: number;
  sliceCount: number;
  isGameOver: boolean;
}