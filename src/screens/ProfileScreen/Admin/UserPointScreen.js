import { View, Text,TouchableOpacity,StyleSheet,FlatList,Image,Alert,RefreshControl,TextInput} from 'react-native';
import React, {useState, useEffect, useContext,useCallback} from 'react';
import { AuthContext } from '../../../utils/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import firebase  from '@react-native-firebase/app';
import moment from 'moment';

const UserPointScreen = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [CommentData, setCommentData] = useState([]);

  const [about, setAbout] = useState(null);
  const [point, setPoint] = useState(null);

  const [friendData, setFriendData] = useState(null);
  const [userData, setUserdData] = useState(null);

  const [deleted, setDeleted] = useState(false);


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const getFriend = async() => {
    const querySanp = await firestore()
    .collection('friends')
    .doc(firebase.auth().currentUser.uid)
    .collection('friendsinfo')
    .get()

    const allfriends = querySanp.docs.map(docSnap=>docSnap.data())
    setFriendData(allfriends)
      
    
  }

  const getUsers = async () => {
    const currentUser = await firestore()
      .collection('users')
      .doc(route.params.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
            setUserdData(documentSnapshot.data());
        }
      });
  };
  const getComment = async() => {
    const querySanp = await firestore()
    .collection('PointInfo')
    .doc(route.params.uid)
    .collection('AboutPoint')
    .orderBy('commentTime', 'desc')
    .get()

    const allcomments = querySanp.docs.map(docSnap=>docSnap.data())
    setCommentData(allcomments)
      
    
  }
  const PlusPoint = async () => {
    

    const querySanp = await firestore()
    .collection('PointInfo')
    .doc(route.params.uid)
    .collection('AboutPoint')
    .add({
  
      Point : "+" + point,
      About : about, 
      commentTime: firestore.Timestamp.fromDate(new Date()),
    })
    .then(() => {
    firestore()
    .collection('users')
    .doc(route.params.uid)
    .update({
  
      point : Number(userData.point) + Number(point)
      
    })
    
      setDeleted(true);
      Alert.alert('포인트 지급 완료!')

     
        
   

      
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }
  const MinusPoint = async () => {
    

    const querySanp = await firestore()
    .collection('PointInfo')
    .doc(route.params.uid)
    .collection('AboutPoint')
    .add({
  
      Point : "-" + point,
      About : about ,
      commentTime: firestore.Timestamp.fromDate(new Date()),

    })
    .then(() => {
    firestore()
    .collection('users')
    .doc(route.params.uid)
    .update({
  
      point : Number(userData.point) - Number(point)
      
    })
    
      setDeleted(true);
      Alert.alert('포인트 차감 완료!')

     
        
   

      
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }
  useEffect(() => {
    getFriend();
    getUsers();
    getComment()
    setDeleted(false);
  }, [deleted,refreshing]);


  const RenderCard = ({item})=>{
    return (
        <View style={{flexDirection:'row',flex:1,width:370,marginBottom: 10}}>
        <Text style={{fontFamily : "Jalnan", fontSize : 15,textAlign:"left"}}>{moment(item.commentTime.toDate()).fromNow()}</Text>
        <Text style={{flex : 1,fontFamily : "Jalnan", fontSize : 15,textAlign : "center"}}> {item.About}</Text>
        <Text style={{flex : 1,fontFamily : "Jalnan", fontSize : 15,textAlign:"right"}}> {item.Point}</Text>
         

         

        
        </View>
    )
}
    return (
    <View style={styles.container}>
        <Text style={{fontSize:20, paddingBottom: 10, fontFamily : "Jalnan"}}>{route.params.name}님의 포인트 내역</Text>
        <View style={styles.title}>
        <View style={{width:40}}></View>
     
          <View style={{width:40}}></View>
          
        </View>
        <FlatList 
          data={CommentData}
          renderItem={({item})=> {return <RenderCard item={item} />
        
        }}

        refreshControl={
          <RefreshControl
             refreshing={refreshing}
             onRefresh={onRefresh}
           />
         }
        />
        <View style={{marginRight : 110}  }>
      <TextInput
            style={styles.textInput}
            value={point}
            onChangeText={(text) => {setPoint(text)}}
            placeholder="지급하거나 차감할 포인트"
          />
          </View>
      <View style={{flexDirection : 'row'}}>
      <TextInput
            style={styles.textInput}
            value={about}
            onChangeText={(text) => {setAbout(text)}}
            placeholder="포인트를 지급하는 이유"
          />
          
          <TouchableOpacity onPress={() => PlusPoint()}>
          <Text style ={{color : 'orange',fontFamily :  'Jalnan', paddingHorizontal: 10, marginTop : 10, fontSize : 18}}>지급</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => MinusPoint()}>
          <Text style ={{color : 'red' ,fontFamily :  'Jalnan', paddingHorizontal: 10, marginTop : 10, fontSize : 18}}>차감</Text>
          </TouchableOpacity>
      
        </View>
        
        </View>
        
        
    
  );
};

export default UserPointScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column', // 혹은 'column'
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
    textInput: {
        marginBottom: 10,
        borderBottomWidth :1,
        borderBottomColor: 'orange',
        borderColor:'rgba(0,0,0,0)',
        height: 45,
        width : 250,
        fontFamily:'Jalnan',
        fontSize:16,
        borderWidth: 1
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
    message: {
        fontSize: 15,
        marginTop : 5,
        fontFamily : 'Jalnan'
      },
  });
