import { Vec3 } from "../math/vec3";
import { Vec4 } from "../math/vec4";

/**
 * Class combining position (three-element vector) and orientation (quaternion)
 */
export interface Pose {
    orientation: Vec4;
    position: Vec3;
}
