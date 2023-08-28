import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import IconButton from "./components/IconButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAppOptionsShown, setIsAppOptionsShown] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pickedEmoji, setPickedEmoji] = useState(null)
  const placeholderImage = require("./assets/images/background-image.png");

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

  const onSaveImageAsync = () => {};

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImage={placeholderImage}
          selectedImage={selectedImage}
        />
        {pickedEmoji && <EmojiSticker stickerSource={pickedEmoji} imageSize={40} />}
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
