import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../StoreScreen/colors';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {AuthContext} from '../../../utils/AuthProvider';
import useStore from '../../../../store/store';

const CheckItem = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const {settooladdress, BuyItem, countItem, setcountItem, setwhfmrl} =useStore();
  const [userData, setUserData] = useState(null);

  const plant = route.params;

  const [Item, setItem] = useState('');
  const Checktype = () => {
    if (plant.type == 'tool') return setItem('tool');
    if (plant.type == 'minime') return setItem('minime');
    if (plant.type == 'background') return setItem('background');
    if (plant.type == 'minipat') return setItem('minipat');
  };
  const getUser = async () => {
    const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };
  useEffect(() => {
    Checktype();
    getUser();
  }, []);

  const Disposition = () => {
    Alert.alert(
      '알림',
      '배치하시겠습니까?',
      [
        {
          text: '아니요',
          onPress: () => console.log('안해욧'),
        },
        {
          text: '네',
          onPress: () =>
            pushTool(
              plant.tool[plant.idx].address,
              plant.tool[plant.idx].name,
              plant.tool[plant.idx].size,
            ),
        },
      ],
      {cancelable: false},
    );
  };

  const pushTool = (address, name, size) => {
    firestore()
      .collection('miniroom')
      .doc(firebase.auth().currentUser.uid)
      .collection('room')
      .doc(firebase.auth().currentUser.uid)
      .collection('tool')
      .doc(name)
      .set({
        name: name,
        address: address,
        getx: 1,
        gety: 1,
        size: size,
      });
    settooladdress(address);
    setcountItem();
    navigation.reset({
      routes: [
        {
          name: 'Miniroom',
        },
      ],
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <View style={{flex: 1}}>
        <View style={style.header}>
          {/* <Icon
            name="arrow-back"
            size={28}
            onPress={() => navigation.goBack()}
          /> */}
          <Text style={{fontSize: 18, marginTop: 3, fontFamily: 'Jalnan'}}>
            <Icons name="coins" size={18} /> {userData ? userData.point : ''}
          </Text>
        </View>
        <View style={style.imageContainer}>
          <Image
            source={{uri: plant && plant.tool[plant.idx].address}}
            style={{resizeMode: 'contain', flex: 1, aspectRatio: 1}}
          />
        </View>
        <View style={style.detailsContainer}>
          <View
            style={{
              marginLeft: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 21, fontFamily: 'Jalnan'}}>
              {plant && plant.tool[plant.idx].name}
            </Text>
            <View>
              <View style={style.priceTag}>
                <Text
                  style={{
                    marginLeft: 15,
                    color: COLORS.white,
                    fontSize: 18,
                    marginRight: 10,
                    fontFamily: 'Jalnan',
                  }}>
                  ₩{plant && plant.tool[plant.idx].price}
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 20, marginTop: 10}}>
            <View style={{height: 100}}>
              <ScrollView>
                <Text style={{fontSize: 20, fontFamily: 'Jalnan'}}>About</Text>
                <Text
                  style={{
                    fontFamily: 'Jalnan',
                    color: 'grey',
                    fontSize: 16,
                    lineHeight: 22,
                    marginTop: 10,
                  }}>
                  {plant && plant.tool[plant.idx].name}
                </Text>
              </ScrollView>
            </View>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={Disposition}>
                <View style={style.buyBtn}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 18,
                      fontFamily: 'Jalnan',
                    }}>
                    배치
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 0.45,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 0.55,
    backgroundColor: COLORS.light,
    marginHorizontal: 7,
    marginBottom: 7,
    borderRadius: 20,
    marginTop: 30,
    paddingTop: 30,
  },
  line: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
  },
  borderBtn: {
    elevation: 2,
    borderColor: 'rgba(255, 0, 0, 0)',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    width: 60,
    height: 40,
  },
  borderBtnText: {fontWeight: 'bold', fontSize: 28, fontFamily: 'Jalnan'},
  buyBtn: {
    width: 80,
    height: 50,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  priceTag: {
    backgroundColor: 'orange',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
});

export default CheckItem;
