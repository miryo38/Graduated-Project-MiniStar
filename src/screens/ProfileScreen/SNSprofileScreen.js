import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AuthContext } from '../../utils/AuthProvider';
import firebase  from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import PostCard from '../../utils/PostCard';

const SNSProfileScreen = ({navigation, route}) => {
  const {user, logout} = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [LoginuserData, setLoginUserData] = useState(null);

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('uid', '==', route.params ? route.params.uid : user.uid)
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              uid,
              post,
              postImg,
              postTime,
              likes,
              comments,
            } = doc.data();
            list.push({
              id: doc.id,
              uid,
              userName: 'Test Name',
              userImg:
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
              postTime: postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            });
          });
        });

      setPosts(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  };
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
        Alert.alert(
          '회원님에게 친구를 요청하였습니다',
        );
  
        
      })
      .catch((error) => {
        console.log('error.', error);
      });
    
  };
  const getUser = async() => {
    await firestore()
    .collection('users')
    .doc( route.params ? route.params.uid : user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }
  const getLoginUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setLoginUserData(documentSnapshot.data());
      }
    })
  }
  useEffect(() => {
    getUser();
    fetchPosts();
    getLoginUser();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);

  const handleDelete = () => {};

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.userImg}
          source={{uri: userData ? userData.userImg || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'}}
        />
        <Text style={styles.userName}>{userData ? userData.name : ''}</Text>
        {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
        <Text style={styles.aboutUser}>
        {userData ? userData.about || '자유로운 소통공간 미니스타!' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          
          {firebase.auth().currentUser.uid === userData ? userData.uid : ''  ? (
            <>
             <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => logout()}>
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
              
              
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.userBtn}  onPress={() => navigation.navigate('CHAT', {name:userData.name,uid:userData.uid,img:userData.userImg,about:userData.about
        
      })}>

                <Text style={styles.userBtnTxt}>메세지</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => FriendRequest()}>
                <Text style={styles.userBtnTxt}>친구 요청</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}>게시물</Text>
          </View>
          <TouchableOpacity style={styles.userInfoTitle} onPress={() => navigation.navigate('SNSProfileScreen', {uid: userData.uid})}>
                <Text style={styles.userInfoTitle}>미니홈피 방문</Text>
              </TouchableOpacity>
        </View>

        {posts.map((item) => (
          <PostCard key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SNSProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontFamily : "Jalnan",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily : "Jalnan",

  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    backgroundColor: '#ffa500',
    borderColor:'#ffa500',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#fff',
    fontFamily : "Jalnan",

  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
        fontFamily : "Jalnan",

  },
  userInfoItem: {
    justifyContent: 'center',
    
  },
  userInfoTitle: {
    fontSize: 20,
    fontFamily : "Jalnan",
    marginBottom: 5,
    textAlign: 'center',
    justifyContent:'center'
  },
  userInfoSubTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily : "Jalnan",
  },
  
});