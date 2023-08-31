import { View, Image } from 'react-native';
import { PanGestureHandler,TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View)

export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleImage = useSharedValue(imageSize)
   const transX = useSharedValue(0);
   const transY = useSharedValue(0);

  const AnimateImage = Animated.createAnimatedComponent(Image);

  const onDrag = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.transX = transX.value;
      context.transY = transY.value;
    },
    onActive: (event, context) => {
      transX.value = event.translationX + context.transX;
      transY.value = event.translationY + context.transY;
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: transX.value,
        },
        {
          translateY: transY.value,
        },
      ],
    };
  });
  
  
 
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
    }else{
      scaleImage.value = imageSize;
    }
  },
  }) 
  

  return (
    <PanGestureHandler onGestureEvent={onDrag}>

    <AnimatedView style={[containerStyle, {top: -350}]}>
      <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}> 

      <AnimateImage
        source={stickerSource}
        resizeMode="contain"
        style={[imageStyle, {width: imageSize, height: imageSize}]}
      />

      </TapGestureHandler>
    </AnimatedView>
    </PanGestureHandler>
  );
}
