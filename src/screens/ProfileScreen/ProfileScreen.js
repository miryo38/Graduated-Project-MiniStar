import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Button,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import {AuthContext} from '../../utils/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import songs from '../../data/songdata';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loading from '../../utils/Loading';
import {songT} from '../../components/MusicPlayer/MusicPlayer';
import ViewShot from 'react-native-view-shot';
import storage from '@react-native-firebase/storage';
import {theme} from '../../Chat/ChatTheme';
import moment from 'moment';
import useStore from '../../../store/store';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import counterSlice, {up} from '../../../slices/counter';
const ProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [friendData, setFriendData] = useState([]);
  const [songIndex, setSongIndex] = useState(0);
  const [LoginuserData, setLoginUserData] = useState(null);
  const [RequestData, setRequestData] = useState([]);
  const [ready, setReady] = useState(true);
  const captureRef = useRef();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [CommentData, setCommentData] = useState([]);
  const {countItem, BuyItem} = useStore();
  const isFocused = useIsFocused();

  
  const dispatch = useDispatch();
  const CheckadminEmail = useSelector(state => {
    return state.user.email;
  });
  console.log('이메일은~~', CheckadminEmail);
  const showToast = name => {
    Toast.show({
      type: 'success',
      text1: '저장완료!',
      text2: `정상적으로 저장했습니다!👋`,
    });
  };

  const getComment = async () => {
    const querySanp = await firestore()
      .collection('guestbook')
      .doc(route.params ? route.params.uid : user.uid)
      .collection('comment')
      .orderBy('commentTime', 'desc')
      .get();

    const allcomments = querySanp.docs.map(docSnap => docSnap.data());
    setCommentData(allcomments);
  };
  const uploadImage = async () => {
    const uploadUri = await getPhotoUri();

    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);

    const storageRef = storage().ref(`miniRoomImage/${filename}`);
    const task = storageRef.putFile(uploadUri);
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      console.log('uri', url);

      setUploading(false);
      setImage(null);
      firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          miniRoom: url,
        });
      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const getPhotoUri = async () => {
    const uri = await captureRef.current.capture();
    console.log('👂👂 Image saved to', uri);
    return uri;
  };

  const onSave = async () => {
    const uri = await getPhotoUri();
    const imageuri = uploadImage();
    console.log('Image Url: ', imageuri);
  };

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.uid : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };
  const getLoginUser = async () => {
    const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setLoginUserData(documentSnapshot.data());
        }
      });
  };

  const getRequest = async () => {
    const querySanp = await firestore()
      .collection('Request')
      .doc(firebase.auth().currentUser.uid)
      .collection('RequestInfo')
      .get();
    const allRequests = querySanp.docs.map(docSnap => docSnap.data());
    //  console.log(allusers)
    console.log('Requests: ', RequestData);
    setRequestData(allRequests);
  };

  const fetchFriends = async () => {
    try {
      const list = [];

      await firestore()
        .collection('friends')
        .doc(firebase.auth().currentUser.uid)
        .collection('friendsinfo')
        .get()
        .then(querySnapshot => {
          console.log('Total Friends: ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            const {name, sname, birthday} = doc.data();
            list.push({
              name,
              sname,
              birthday,
            });
          });
        });

      setFriendData(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Friends: ', friendData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setReady(false);
    }, 1000);
    getUser();
    fetchFriends();
    getLoginUser();
    getRequest();
    getComment();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading, countItem, BuyItem, isFocused]);

  const FriendRequest = () => {
    Alert.alert(
      '회원님에게 친구요청을 보냅니다',
      '확실합니까?',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed!'),
          style: '취소',
        },
        {
          text: '확인',
          onPress: () => Requset(),
        },
      ],
      {cancelable: false},
    );
  };

  const Requset = () => {
    firestore()
      .collection('Request')
      .doc(route.params ? route.params.uid : user.uid)
      .collection('RequestInfo')
      .doc(firebase.auth().currentUser.uid)
      .set({
        uid: firebase.auth().currentUser.uid,
        name: LoginuserData.name,
        sname: '별명',
        birthday: LoginuserData.birthday,
        userimg: LoginuserData.userImg,
      })
      .then(() => {
        console.log('requset Added!');
        Alert.alert('회원님에게 친구를 요청하였습니다');
      })
      .catch(error => {
        console.log('error.', error);
      });
  };

  const onprofilePressed = () => {
    navigation.navigate('EditProfile');
  };
  const onMusicPressed = () => {
    navigation.navigate('Music');
  };
  const onEditFriendPressed = () => {
    navigation.navigate('Friend');
  };

  const onRequsetPressed = () => {
    navigation.navigate('Requset');
  };
  const onweblogpress = () => {
    navigation.navigate('Weblog', {
      name: userData.name,
      uid: route.params ? route.params.uid : user.uid,
    });
  };

  const onDiarypress = () => {
    navigation.navigate('Diary', {
      name: userData.name,
      uid: route.params ? route.params.uid : user.uid,
    });
  };
  const onalbumpress = () => {
    navigation.navigate('Album', {
      name: userData.name,
      uid: route.params ? route.params.uid : user.uid,
    });
  };

  const onMiniroompress = () => {
    navigation.navigate('Miniroom');
  };

  const UserScreenPressed = () => {
    navigation.navigate('UserScreen');
  };

  const ReportScreenPressed = () => {
    navigation.navigate('ReportScreen');
  };

  const AddStorePressed = () => {
    navigation.navigate('AddStore');
  };

  return ready ? (
    <Loading />
  ) : (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {(() => {
        if (CheckadminEmail && CheckadminEmail == 'admin@gmail.com')
          // 관리자 구분
          return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
              <View style={styles.title}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View style={{marginLeft: 15}}>
                    <Text style={styles.titleText}>관리자 모드</Text>
                  </View>
                </View>
              </View>
              <Image
                source={require('../../../assets/logo2.png')}
                style={styles.logo}
              />
              <View style={styles.userBtnWrapper2}>
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 20,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => UserScreenPressed()}>
                    <Ionicons name="person" size={30} />
                    <Text style={styles.userBtnTxt2}> 회원 관리</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginBottom: 20, alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => ReportScreenPressed()}>
                    <Icon name="emoji-sad" size={30} />
                    <Text style={styles.userBtnTxt2}> 신고 게시글 관리</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginBottom: 20, alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => AddStorePressed()}>
                    <Icon name="shop" size={30} />
                    <Text style={styles.userBtnTxt2}> 미니룸 스토어 아이템 관리</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        else {
          return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
              
              <View style={styles.title}>
                {route.params ? (
                  <>
                  <View style={{flexDirection : 'row', marginTop : 10}}>
                    <TouchableOpacity
                      style={{marginLeft: 15, justifyContent: 'center'}}
                      onPress={() => navigation.goBack()}>
                      <Ionicons name="arrow-back" size={25} color="#fff" />
                    </TouchableOpacity>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.titleText}>
                        {userData ? userData.name : ''}님의 미니홈피
                      </Text>
                    </View>
                    </View>
                    
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        marginTop : 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <View style={{marginLeft: 15}}>
                        <Text style={styles.titleText}>
                          {userData ? userData.name : ''}님의 미니홈피
                        </Text>
                      </View>
                      
                    </View>
                  </>
                )}
              </View>

              <ScrollView
                style={styles.container}
                contentContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.guestBtn}>
                  <View style={styles.titlecontainer}>
                    <View style={styles.leftcontainer}>
                      <TouchableOpacity onPress={() => onprofilePressed()}>
                        <Image
                          style={styles.userImg}
                          source={{
                            uri: userData
                              ? userData.userImg ||
                                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.rightcontainer}>
                      <View style={styles.action}>
                        <Text style={{fontFamily: 'Jalnan'}}>이름</Text>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{fontFamily: 'Jalnan'}}>
                            {userData ? userData.name : ''}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.action}>
                        <Text style={{fontFamily: 'Jalnan'}}>나이</Text>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{fontFamily: 'Jalnan'}}>
                            {userData ? userData.age : ''}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.action}>
                        <Text style={{fontFamily: 'Jalnan'}}>생일</Text>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{fontFamily: 'Jalnan'}}>
                            {userData ? userData.birthday : ''}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.action}>
                        <Text style={{fontFamily: 'Jalnan'}}>포인트</Text>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{fontFamily: 'Jalnan', marginRight: 15}}>
                            {userData ? userData.point : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.guestBtn}>
                  <View style={styles.userInfoWrapper}>
                    {route.params ? (
                      <>
                        <TouchableOpacity onPress={() => FriendRequest()}>
                          <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle2}>친구요청</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('SNSProfile', {
                              uid: userData.uid,
                            })
                          }>
                          <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle2}>SNS 방문</Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity onPress={() => onEditFriendPressed()}>
                          <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle2}>
                              친구{' '}
                              <Text style={styles.userInfoTitle}>
                                {friendData.length}
                              </Text>
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => onRequsetPressed()}>
                          <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle2}>
                              요청 목록{' '}
                              <Text style={styles.userInfoTitle}>
                                {RequestData.length}
                              </Text>
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('SNSProfile', {
                              uid: userData.uid,
                            })
                          }>
                          <View style={styles.userInfoItem}>
                            <Text style={styles.userInfoTitle2}>SNS 방문</Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  <View style={styles.userBtnWrapper}>
                    <TouchableOpacity
                      style={styles.userBtn}
                      onPress={() => onDiarypress()}>
                      <Text style={styles.userBtnTxt}>다이어리</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.userBtn}
                      onPress={() => onalbumpress()}>
                      <Text style={styles.userBtnTxt}> 사진첩</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.userBtn}
                      onPress={() => onweblogpress()}>
                      <Text style={styles.userBtnTxt}> 방명록</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.guestBtn}>
                  <ViewShot
                    ref={captureRef}
                    options={{
                      format: 'jpg',
                      quality: 0.9,
                      backgroundColor: 'white',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          textAlign: 'center',
                          fontFamily: 'Jalnan',
                          color: '#696969',
                          marginTop: 10,
                        }}>
                        {userData ? userData.name : ''}님의 Mini Room
                      </Text>
                      <TouchableOpacity
                        style={styles.miniroom}
                        onPress={() => onMiniroompress()}>
                        <Image
                          source={{
                            uri: userData
                              ? userData.miniRoom ||
                                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                          }}
                          style={{
                            width: '100%',
                            height: 200,
                            marginBottom: 0,
                            resizeMode: 'cover',
                          }}></Image>
                      </TouchableOpacity>
                    </View>
                  </ViewShot>
                </View>
                <View style={styles.guestBtn2}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 5,
                      fontFamily: 'Jalnan',
                      textAlign: 'center',
                    }}>
                    친구들의 방명록
                  </Text>
                </View>

                {CommentData?.map((row, idx) => {
                  return (
                    <View style={styles.guestBtn3}>
                      <View style={styles.conversation}>
                        <View style={[styles.imageContainer]}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('ProfileScreen', {
                                uid: row.uid,
                              })
                            }>
                            <Image
                              source={{uri: row.userImg}}
                              style={styles.img}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            marginLeft: 15,
                            flex: 1,
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text numerOfLine={1} style={styles.username}>
                              {row.name}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text style={styles.message}>{row.comment}</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text style={styles.message}>
                              {moment(row.commentTime.toDate()).fromNow()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          );
        }
      })()}
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  titlecontainer: {
    flex: 1,
    flexDirection: 'row', // 혹은 'column'
  },
  leftcontainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userinfotext: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightcontainer: {
    flex: 0.8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    marginTop: 10,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 250,
    width: 350,
    resizeMode: 'cover',
    marginBottom: 20,
    marginTop: 20,
  },
  imageContainer: {
    marginLeft: 10,
    borderRadius: 25,
    height: 60,
    width: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  music: {
    marginTop: 10,
    height: 25,
    marginLeft: 25,
    marginRight: 25,
  },
  username: {
    fontSize: theme.fontSize.title,
    color: '#696969',
    width: 210,
    fontFamily: 'Jalnan',
  },
  message: {
    fontSize: theme.fontSize.message,
    width: 240,
    color: theme.colors.subTitle,
    marginTop: 5,
    fontFamily: 'Jalnan',
  },

  title: {
    height: 50,
    backgroundColor: 'orange',
  },
  img: {width: 60, height: 60, borderRadius: 30, backgroundColor: 'orange'},
  titleText: {
    fontFamily: 'Jalnan',
    justifyContent: 'space-around',
    fontSize: 20,
    color: 'white',
  },
  conversation: {
    flexDirection: 'row',
    paddingBottom: 25,
    paddingRight: 20,
    paddingTop: 20,
  },
  userImg: {
    height: 125,
    width: 125,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  action: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 1,

    paddingBottom: 5,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  userBtnWrapper2: {
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
  },
  userBtn: {
    width: 120,
    backgroundColor: '#fff',
    borderColor: 'orange',
    borderBottomColor: '#fff',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    alignItems: 'center',
  },
  guestBtn: {
    width: 395,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderBottomColor: '#fff',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 10,
  },
  guestBtn3: {
    width: 395,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderBottomColor: '#fff',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  guestBtn2: {
    width: 395,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderBottomColor: '#fff',
    borderWidth: 1,
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  guestBtn3: {
    width: 395,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderBottomColor: '#fff',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  guestBtn2: {
    width: 395,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderBottomColor: '#fff',
    borderWidth: 1,
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userBtnTxt: {
    fontFamily: 'Jalnan',
    color: '#696969',
    textAlign: 'center',
    fontSize: 15,
  },
  userBtnTxt2: {
    fontFamily: 'Jalnan',
    color: '#696969',
    fontSize: 25,
  },
  userInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    color: 'orange',

    fontSize: 18,

    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoTitle2: {
    color: '#696969',
    fontFamily: 'Jalnan',
    fontSize: 18,
    marginBottom: 5,
  },
  userInfoSubTitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
  },
  miniroom: {
    width: '100%',
    height: 200,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
});
