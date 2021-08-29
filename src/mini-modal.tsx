import * as React from "react";
import { Component } from "react";
import {
  Animated,
  Easing,
  Modal as ReactNativeModal,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";
import { AnimationPreset, animationPresets } from "./animation-presets";
import { getContentAnimatedStyle } from "./animations";

interface MiniModalProps {
  onBackdropPress: () => void;
  onHide: () => void;
  animationPreset: AnimationPreset;
  animationInDuration: number;
  animationOutDuration: number;
  backdropColor: string;
  backdropOpacity: number;
  contentStyle: ViewStyle;
  visible: boolean;
}

interface MiniModalState {
  visible: boolean;
  animationDirection: "none" | "in" | "out";
}

export class MiniModal extends Component<MiniModalProps, MiniModalState> {
  static defaultProps = {
    onBackdropPress: () => undefined,
    onHide: () => undefined,
    animationPreset: animationPresets.nativeDialogAnimationPreset,
    animationInDuration: 300,
    animationOutDuration: 300,
    backdropColor: "black",
    backdropOpacity: 0.3,
    contentStyle: {},
    visible: false,
  };

  state: MiniModalState = {
    visible: Boolean(this.props.visible),
    animationDirection: "none",
  };

  animationValue = new Animated.Value(0);
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    if (this.state.visible) {
      this.show();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: MiniModalProps) {
    if (this.props.visible && !prevProps.visible) {
      this.show();
    } else if (!this.props.visible && prevProps.visible) {
      this.hide();
    }
  }

  show = () => {
    this.setState({ visible: true, animationDirection: "in" }, () => {
      Animated.timing(this.animationValue, {
        easing: Easing.inOut(Easing.quad),
        // Using native driver in the modal makes the content flash
        useNativeDriver: false,
        duration: this.props.animationInDuration,
        toValue: 1,
      }).start(() => {
        this.setState({ animationDirection: "none" });
      });
    });
  };

  hide = () => {
    this.setState({ animationDirection: "out" }, () => {
      Animated.timing(this.animationValue, {
        easing: Easing.inOut(Easing.quad),
        // Using native driver in the modal makes the content flash
        useNativeDriver: false,
        duration: this.props.animationOutDuration,
        toValue: 0,
      }).start(() => {
        if (this._isMounted) {
          this.setState({ animationDirection: "none" });
          this.setState({ visible: false }, this.props.onHide);
        }
      });
    });
  };

  render() {
    const {
      children,
      backdropColor,
      onBackdropPress,
      contentStyle,
      animationPreset,
      ...otherProps
    } = this.props;
    const { animationDirection, visible } = this.state;

    const backdropAnimatedStyle = {
      opacity: this.animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.props.backdropOpacity],
      }),
    };

    const contentAnimatedStyle = animationPreset
      ? getContentAnimatedStyle(
          this.animationValue,
          animationDirection,
          animationPreset
        )
      : {};

    return (
      <ReactNativeModal
        transparent
        animationType="none"
        {...otherProps}
        visible={visible}
      >
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              { backgroundColor: backdropColor },
              backdropAnimatedStyle,
            ]}
          />
        </TouchableWithoutFeedback>
        {visible && (
          <Animated.View
            style={[styles.content, contentAnimatedStyle, contentStyle]}
            pointerEvents="box-none"
            // Setting "needsOffscreenAlphaCompositing" solves a janky elevation
            // animation on android. We should set it only while animating
            // to avoid using more memory than needed.
            // See: https://github.com/facebook/react-native/issues/23090
            needsOffscreenAlphaCompositing={["in", "out"].includes(
              animationDirection
            )}
          >
            {children}
          </Animated.View>
        )}
      </ReactNativeModal>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MiniModal;
