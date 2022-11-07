import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import useStore from '../../../store/store';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Draggable from 'react-native-draggable';
import Toast from 'react-native-toast-message';

const MiniroomBox = ({}) => {
  const addminiroom = firestore()
    .collection('miniroom')
    .doc(firebase.auth().currentUser.uid)
    .collection('room')
    .doc(firebase.auth().currentUser.uid)
    .collection('tool');
  const {countItem, setcountItem, setplaceX, placeX} = useStore();
  const [tool, setTool] = useState();

  const getTool = async () => {
    try {
      console.log('겟툴');
      const datatool = await addminiroom.get();
      setTool(datatool._docs.map(doc => ({...doc.data(), id: doc.id})));
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getTool();
  }, [countItem]);
  const DeleteToast = name => {
    Toast.show({
      type: 'success',
      text1: '삭제완료!',
      text2: `${name}을 정상적으로 삭제했습니다!👋`,
    });
  };

  const addItem = async (x, y, address, name) => {
    const rows = addminiroom.where('name', '==', name);
    await rows.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.update({
          getx: x,
          gety: y,
          address: address,
          name: name,
        });
      });
    });
  };
  const DeleteItem = async name => {
    const rows = addminiroom.where('name', '==', name);
    await rows.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
        setcountItem();
      });
    });
  };

  return (
    <View style={{position: 'absolute'}}>
      {tool &&
        tool.map((row, idx) => {
          {
            return (
              <Draggable
                x={row.getx}
                y={row.gety}
                z={idx}
                resize="cover"
                renderSize={row.size}
                imageSource={{uri: `${row.address}`}}
                onDragRelease={(e, g, b) => {
                  addItem(b.left, b.top, row.address, row.name);
                }}
                onRelease={() => {
                  setplaceX();
                  console.log(placeX);
                }}
                debug={true}
                onLongPress={() => {
                  Alert.alert(
                    '알림',
                    '삭제하시겠습니까?',
                    [
                      {
                        text: '아니요',
                        onPress: () => console.log('안사욧'),
                      },
                      {
                        text: '네',
                        onPress: () => {
                          DeleteToast(row.name);
                          DeleteItem(row.name);
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}></Draggable>
            );
          }
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 70,
    width: 70,
    position: 'absolute',
  },
});
export default MiniroomBox;
