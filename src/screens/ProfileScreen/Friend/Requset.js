import { View, Text,TouchableOpacity,StyleSheet,FlatList,Image,Button,Alert,RefreshControl} from 'react-native';
import React, {useState, useEffect, useContext,useCallback} from 'react';
import { AuthContext } from '../../../utils/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import firebase  from '@react-native-firebase/app';
import { useNavigation } from "@react-navigation/native";

const Request = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {user, logout} = useContext(AuthContext);
  const [requsetData, setRequsetData] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigation = useNavigation();

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getRequset = async() => {
    const querySanp = await firestore()
    .collection('Request')
    .doc(firebase.auth().currentUser.uid)
    .collection('RequestInfo')
    .get()

    const allrequests = querySanp.docs.map(docSnap=>docSnap.data())
    setRequsetData(allrequests)
  }

  const getUser = async() => {
    await firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }
  const FriendRequestCheck = (item) => {
    Alert.alert(
      '친구 요청을 수락합니다',
      '확실합니까?',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed!'),
          style: '취소',
        },
        {
          text: '확인',
          onPress: () => RequsetCheck(item),
        },
      ],
      {cancelable: false},
    );
  };
  const RequsetCheck = (item) => {
    

    firestore()
      .collection('friends')
      .doc(firebase.auth().currentUser.uid)
      .collection('friendsinfo')
      .doc(item.uid)
      .set({
  
        uid: item.uid,
        name: item.name,
        sname: '별명',
        birthday: item.birthday,
        userimg: item.userimg,
      })
      .then(() => {
        firestore()
      .collection('friends')
      .doc(item.uid)
      .collection('friendsinfo')
      .doc(firebase.auth().currentUser.uid)
      .set({
  
        uid: firebase.auth().currentUser.uid,
        name: userData.name,
        sname: '별명',
        birthday: userData.birthday,
        userimg: userData.userImg,
      }).then(() => {
        firestore()
      .collection('Request')
      .doc(firebase.auth().currentUser.uid)
      .collection('RequestInfo')
      .doc(item.uid)
      .delete()
        console.log('requset Added!');
        Alert.alert(
          '친구 추가 완료!',
          );
        setDeleted(true);

    
        
  
        
      })
    })
      .catch((error) => {
        console.log('error.', error);
      });
    
  };
  useEffect(() => {
    getRequset();
    getUser();
    setDeleted(false);
  }, [deleted,refreshing]);

  const RenderCard = ({item})=>{
    return (
        <View style={{flexDirection:'row',flex:1,width:370,marginBottom: 10}}>
          
          <View style={{width:40,height:40,marginRight:20}}>
                 <TouchableOpacity style={styles.imageContainer} onPress={() => navigation.navigate('ProfileScreen', {uid: item.uid})}>
            <Image style={styles.image} source={{uri: item.userimg}}/>
          </TouchableOpacity>
          </View>
          
          <View style={{flexDirection:'row',flex: 1, justifyContent: "space-between", alignItems: "center"}}>
          <Text style={{fontFamily : "Jalnan",marginLeft : 10}}>{item.name}</Text>
          <Text style={{fontFamily : "Jalnan",marginLeft : 30}}>{item.sname}</Text>
          <Text style={{fontFamily : "Jalnan",marginLeft : 20}}>{item.birthday}</Text>
          <TouchableOpacity style={styles.button} onPress={() => FriendRequestCheck(item)}>
              <Text style={styles.userBtnTxt}>확인</Text>
          </TouchableOpacity>
          </View>
        
        </View>
    )
}
    return (
    <View style={styles.container}>
        <Text style={{fontSize:20, marginBottom: 10,fontFamily : "Jalnan"}}>요청 목록</Text>
        <View style={styles.title}>
          <View style={{width:40}}></View>
          <Text style={{flex:1,textAlign: 'center',fontFamily : "Jalnan"}}>이름</Text>
          <Text style={{flex:1,textAlign: 'center',fontFamily : "Jalnan"}}>별명</Text>
          <Text style={{flex:1,textAlign: 'center',fontFamily : "Jalnan"}}>생일</Text>  
          <View style={{width:40}}></View>
        </View>
        <FlatList 
          data={requsetData}
          renderItem={({item})=> {return <RenderCard item={item} />
         }}
         refreshControl={
         <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        />
    </View>
        
    
  );
};

export default Request;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
      alignItems: 'center',
    },
    title:{
      flexDirection: 'row', // 혹은 'column'
      marginBottom:10,
    },
    title2:{
      flexDirection: 'row', // 혹은 'column'
    },
    miniroom: {
      width:'100%', 
      height:150,
      justifyContent: 'space-around',
      alignItems:'center',
      marginTop: 30,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderColor: 'green',
      
    },
    imageContainer: {
      borderRadius: 20,
      height: 40,
      width: 40,
      overflow: 'hidden',
    },
    image: {
      height: 40,
      width: 40
    },
    userBtnTxt: {
      fontFamily: "DungGeunMo",
      color: '#fff',
      textAlign:'center',  
      fontSize:15,
    },
    button: {
      marginRight:10,
      width: 50,
      height: 30,
      backgroundColor: "orange",
      borderColor: 'orange',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomColor:'#fff',
      justifyContent: "center",
      alignItems: "center"
     
    },
    userBtnTxt: {
      fontFamily: "Jalnan",
      color: '#fff',
      textAlign:'center',  
      fontSize:15,
    },
  
  });