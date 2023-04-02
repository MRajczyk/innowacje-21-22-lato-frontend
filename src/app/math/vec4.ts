import {Vec3} from "./vec3";
import {Angles} from "./angles";

/**
 * Class containing four numerical values x, y, z, w.
 * With util functions treating Vec4 as quaternion.
 */
export class Vec4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Construct Vec4 representing quaternion from axis and angle
   * qx = ax * sin(angle/2)
   * qy = ay * sin(angle/2)
   * qz = az * sin(angle/2)
   * qw = cos(angle/2)
   * @param axis axis, does not have to be normalised
   * @param angle angle in degrees
   */
  public static quaternion(axis: Vec3, angle: number): Vec4 {
    let ax = axis.x;
    let ay = axis.y;
    let az = axis.z;

    const lenPow2 = axis.x * axis.x + axis.y * axis.y + axis.z * axis.z;
    if(Math.abs(lenPow2 - 1.0) > Number.EPSILON) {
      const len = Math.sqrt(lenPow2);
      ax = ax / len;
      ay = ay / len;
      az = az / len;
    }

    if(angle < 0) {
      angle = 360 - angle % 360;
    }

    const halfAngle = Angles.radians(angle / 2);
    const sin = Math.sin(halfAngle);

    return new Vec4(
      ax * sin,
      ay * sin,
      az * sin,
      Math.cos(halfAngle)
    );
  }

  /**
   * Gets angle of quaternion
   * angle = 2 * acos(qw)
   * @param quaternion Vec4
   * @return angle in degrees
   */
  public static angleOfQuaternion(quaternion: Vec4): number {
    const acos = Math.acos(quaternion.w);
    return isNaN(acos) ? 0 : Angles.degrees(acos * 2);
  }

  /**
   * Gets axis of quaternion
   * x = qx / sqrt(1-qw*qw)
   * y = qy / sqrt(1-qw*qw)
   * z = qz / sqrt(1-qw*qw)
   * @param quaternion Vec4
   */
  public static axisOfQuaternion(quaternion: Vec4): Vec3 {
    const sqrt = Math.sqrt(1 - quaternion.w * quaternion.w);

    // if near 0
    if(sqrt < 0.000001)
      return new Vec3(1, 0, 0);

    return new Vec3(
      quaternion.x / sqrt,
      quaternion.y / sqrt,
      quaternion.z / sqrt
    )
  }
}
