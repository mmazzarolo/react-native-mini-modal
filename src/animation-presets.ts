import { Animated, Platform } from "react-native";

interface AnimationPresetConfig {
  opacity?: Animated.InterpolationConfigType;
  transform?: {
    perspective?: Animated.InterpolationConfigType;
    rotate?: Animated.InterpolationConfigType;
    rotateX?: Animated.InterpolationConfigType;
    rotateY?: Animated.InterpolationConfigType;
    rotateZ?: Animated.InterpolationConfigType;
    scale?: Animated.InterpolationConfigType;
    scaleX?: Animated.InterpolationConfigType;
    scaleY?: Animated.InterpolationConfigType;
    translate?: Animated.InterpolationConfigType;
    translateX?: Animated.InterpolationConfigType;
    skewX?: Animated.InterpolationConfigType;
    skewY?: Animated.InterpolationConfigType;
    matrix?: Animated.InterpolationConfigType;
  };
}

export interface AnimationPreset {
  in?: AnimationPresetConfig;
  out?: AnimationPresetConfig;
}

const nativeDialogAnimationPreset: AnimationPreset = {
  in: Platform.select({
    ios: {
      opacity: {
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      },
      transform: {
        scale: {
          inputRange: [0, 0.5, 1],
          outputRange: [1.2, 1.1, 1],
          extrapolate: "clamp",
        },
      },
    },
    android: {
      opacity: {
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 1],
        extrapolate: "clamp",
      },
      transform: {
        scale: {
          inputRange: [0, 1],
          outputRange: [0.3, 1],
          extrapolate: "clamp",
        },
      },
    },
    default: {
      opacity: {
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 1],
        extrapolate: "clamp",
      },
      transform: {
        scale: {
          inputRange: [0, 1],
          outputRange: [0.3, 1],
          extrapolate: "clamp",
        },
      },
    },
  }),
  out: Platform.select({
    default: {
      opacity: {
        inputRange: [0, 1],
        outputRange: [0, 1],
      },
    },
  }),
};

export const animationPresets = {
  nativeDialogAnimationPreset,
};
