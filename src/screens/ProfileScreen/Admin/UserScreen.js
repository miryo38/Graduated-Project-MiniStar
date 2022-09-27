import { View, Text,TouchableOpacity,StyleSheet,FlatList,Image,Alert,RefreshControl,TextInput} from 'react-native';
import React, {useState, useEffect, useContext,useCallback} from 'react';
import { AuthContext } from '../../../utils/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import firebase  from '@react-native-firebase/app';

const UserScreen = ({navigation,route}) => {
  const [refreshing, setRefreshing] = useState(false);

  const {user, logout} = useContext(AuthContext);
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
    try {
      const list = [];

      
     const querySanp = await firestore().collection('users').get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              userImg,
              name,
              uid,
              about,
              email,
              point
            
            
            } = doc.data();
            list.push({
              name,
              uid,
              about,
              userImg,
              email,
              point
            });
          });
        });
        setUserdData(list)
     
     
    
    } catch (e) {
      console.log(e);
    }
  };
  

  
  useEffect(() => {
    getFriend();
    getUsers();
    setDeleted(false);
  }, [deleted,refreshing]);


  const RenderCard = ({item})=>{
    return (
        <View style={{flexDirection:'row',flex:1,width:370,marginBottom: 10}}>
          
          <View style={{width:40,height:40,marginRight:20}}>
                 <TouchableOpacity style={styles.imageContainer} >
            <Image style={styles.image} source={{uri: item.userImg}}/>
          </TouchableOpacity>
          </View>
          <TouchableOpacity style={{flexDirection:'row',flex: 1, justifyContent: "space-between", alignItems: "center"}} onPress={() => navigation.navigate('UserPointScreen',{uid : item.uid , name : item.name, point : item.point } )}>
          <View style={{flexDirection:'row',flex: 1, justifyContent: "space-between", alignItems: "center"}}>
          
          <Text style={{fontFamily : "Jalnan",}}>{item.name}</Text>
          <Text style={{fontFamily : "Jalnan",}}>{item.email}</Text>
          <Text style={{fontFamily : "Jalnan",}}>{item.point}</Text>
          

         
          </View>
          </TouchableOpacity>
        
        </View>
    )
}
    return (
    <View style={styles.container}>
        <Text style={{fontSize:20, paddingBottom: 10, fontFamily : "Jalnan"}}>회원 목록</Text>
        <View style={styles.title}>
        <View style={{width:40}}></View>
        
          <Text style={{flex:1,textAlign: 'center',fontFamily : "Jalnan"}}>이름</Text>
          <Text style={{flex:1,textAlign: 'center',fontFamily : "Jalnan"}}>아이디</Text>
          <Text style={{flex:1,textAlign: 'center',fontFamily : "Jalnan"}}>보유 포인트</Text>  
          
          <View style={{width:40}}></View>
          
        </View>
        <FlatList 
          data={userData}
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

export default UserScreen;
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
    
    textInput: {
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: 10,
      height: 40,
      borderRadius: 10,
      borderColor: 'gray',
      borderWidth: 1
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
