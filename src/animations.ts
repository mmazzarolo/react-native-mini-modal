import { Animated, ViewStyle } from "react-native";
import { AnimationPreset } from "./animation-presets";

export function getContentAnimatedStyle(
  animationValue: Animated.Value,
  animationDirection: "none" | "in" | "out",
  animationPreset: AnimationPreset
) {
  const contentAnimatedStyle: Animated.WithAnimatedObject<ViewStyle> = {};
  if (
    !animationDirection ||
    animationDirection === "none" ||
    !animationPreset[animationDirection]
  ) {
    return contentAnimatedStyle;
  }
  const interpolationConfigs = animationPreset?.[animationDirection] || {};
  if (interpolationConfigs.opacity) {
    contentAnimatedStyle.opacity = animationValue.interpolate(
      interpolationConfigs.opacity
    );
  }
  if (interpolationConfigs.transform) {
    contentAnimatedStyle.transform = [];
    Object.entries(interpolationConfigs.transform).forEach((configEntries) => {
      const [transformAttribute, transformInterpolationConfig] = configEntries;
      // TODO: Hate doing this, but I'm temporarily ignoring these type errors
      // because inferring the animated transform types from React Native's type
      // definition doesn't seem easy (without making the code below a mess).
      // @ts-ignore
      contentAnimatedStyle.transform?.push({
        [transformAttribute]: animationValue.interpolate(
          transformInterpolationConfig
        ),
      });
    });
  }
  return contentAnimatedStyle;
}
