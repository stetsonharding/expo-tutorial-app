import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet,View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import IconButton from "./components/IconButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';



export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAppOptionsShown, setIsAppOptionsShown] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pickedEmoji, setPickedEmoji] = useState(null)
  //Permission to view all media files in users device
  const [status, requestPermission] = MediaLibrary.usePermissions();
  //Default image
  const placeholderImage = require("./assets/images/background-image.png");
  //refrence to image for screenshot
  const imageRef = useRef();

  //if user has not accepted/denied permissions for app to view all media images - request permission..
  if(status === null) {
    requestPermission();
  }


  //Function to handle image picking
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setIsAppOptionsShown(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const onReset = () => {
    setIsAppOptionsShown(false)
    setPickedEmoji(null)
    
  };

  const onAddSticker = () => {
    setIsModalVisible(true)
  };

  const onSaveImageAsync = async () => {
    if(Platform.OS !== 'web') {
      try{
       const localUri = await captureRef(imageRef, {
         height: 440,
         quality: 1,
       });
   
       await MediaLibrary.saveToLibraryAsync(localUri)
       if(localUri){
         alert('Saved!')
       }
      }catch(e) {
       console.log(e)
      }
    }else{
      //Handle saving an image on web based apps
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });
  
        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
        <ImageViewer
          placeholderImage={placeholderImage}
          selectedImage={selectedImage}
        />
        {pickedEmoji && <EmojiSticker stickerSource={pickedEmoji} imageSize={40} />}
        </View>
      </View>
      {isAppOptionsShown ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            label="Choose a photo"
            theme="primary"
            pickImageAsync={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => setIsAppOptionsShown(true)}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
