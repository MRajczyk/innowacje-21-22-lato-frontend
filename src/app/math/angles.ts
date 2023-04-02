export class Angles {
  /**
   * Converts degrees to radians without 2kPi reduction.
   * @param degrees
   */
  public static radians(degrees: number): number {
    const mul = Math.PI / 180;
    return degrees * mul;
  }

  /**
   * Converts radians to degrees without k*360deg reduction.
   * @param radians
   */
  public static degrees(radians: number): number {
    const mul = 180 / Math.PI;
    return radians * mul;
  }
}
