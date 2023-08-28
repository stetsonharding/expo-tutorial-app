import { View, Image } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';



export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleIamge = useSharedValue(imageSize)

  const animateImage = Animated.createAnimatedComponent();

  return (
    <View style={{ top: -350 }}>
      <animateImage
        source={stickerSource}
        resizeMode="contain"
        style={{ width: imageSize, height: imageSize }}
      />
    </View>
  );
}
