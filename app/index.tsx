import { useState, useRef, useMemo, useCallback } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import AuthModal from '@/components/AuthModal';
import * as WebBrowser from 'expo-web-browser';
import { ModalType } from '@/types/enums';
import { Colors } from "@/constants/Colors";

export default function Index() {
  const {top} = useSafeAreaInsets();
  const {showActionSheetWithOptions} = useActionSheet();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['44%'], []);
  const [authType, setAuthType] = useState<ModalType | null>(null);

  const showModal = async (type: ModalType) => {
    setAuthType(type);
    bottomSheetModalRef.current?.present();
  }

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      opacity={0.2}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      {...props}
      onPress={() => bottomSheetModalRef.current?.close()}
    />
  ), [])

  const openLink = () => {
    WebBrowser.openBrowserAsync('https://galaxies.dev');
  }

  const openActionSheet = async () => {
    const options = ['View support docs', 'Contact us', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `Can't log in or sign up?`
      },
      (selectedIndex: any) => {
        console.log(selectedIndex);
      }
    )
  }

  return (
    <BottomSheetModalProvider>
      <View style={[styles.container, {paddingTop: top + 30}]}>
        <Image
          source={require('@/assets/images/login/trello.png')}
          style={styles.image} 
        />
        <Text style={styles.introText}>Move teamwork forward - even on the go</Text>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.btn, {backgroundColor: 'white'}]}
            onPress={() => showModal(ModalType.Login)}  
          >
            <Text style={[styles.btnText, {color: Colors.primary}]}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.btn}
            onPress={() => showModal(ModalType.SignUp)}  
          >
            <Text style={[styles.btnText, {color: 'white'}]}>Sign up</Text>
          </TouchableOpacity>

          <Text style={styles.description}>
            By signing up, you agree to the{' '} 
            <Text style={styles.link} onPress={openLink}>User Notice</Text>
            {' '}and also agree to{' '}
            <Text style={styles.link} onPress={openLink}>Privacy Policy</Text>.
          </Text>

          <Text style={styles.link} onPress={openActionSheet}>
            Can't log in or sign up?
          </Text>
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        handleComponent={null}
        enableOverDrag={false}
        enablePanDownToClose={true}
      >
        <AuthModal authType={authType} />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center' 
  },
  image: {
    height: 400,
    paddingHorizontal: 40,
    resizeMode: 'contain'
  },
  introText: {
    color: 'white',
    fontSize: 17,
    padding: 30
  },
  bottomContainer: {
    width: '100%',
    gap: 10,
    paddingHorizontal: 40
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1
  },
  btnText: {
    fontSize: 18
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    marginHorizontal: 60
  },
  link: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
