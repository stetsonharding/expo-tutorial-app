import { View, Image } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';



export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleImage = useSharedValue(imageSize)

  const AnimateImage = Animated.createAnimatedComponent(Image);
 
  const imageStyle = useAnimatedStyle(() => {
    return{
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value)
    }
  })

  const onDoubleTap = useAnimatedGestureHandler({
    onActive: () => {
      if(scaleImage.value !== imageSize * 2) {
        scaleImage.value = imageSize * 2;
    }
  },
  }) 
  

  return (
    <View style={{ top: -350 }}>
      <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}> 

      <AnimateImage
        source={stickerSource}
        resizeMode="contain"
        style={[imageStyle, {width: imageSize, height: imageSize}]}
      />

      </TapGestureHandler>
    </View>
  );
}
