import { View, Text,TouchableOpacity,StyleSheet,FlatList,Image,TextInput,RefreshControl,Alert,} from 'react-native';
import React, {useState, useEffect, useContext,useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import firebase  from '@react-native-firebase/app';
import { theme } from '../../../Chat/ChatTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const Comment = ({navigation,route}) => {
  const [number, setNumber] = useState(0);
  const [CommentData, setCommentData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [comment, setComment] = useState(null);
  const {uid} = route.params
  const [deleted, setDeleted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const getComment = async() => {
    const querySanp = await firestore()
    .collection('Albums')
    .doc(route.params ? route.params.uid : user.uid)
    .collection('groups')
    .doc(route.params.foldername)
    .collection('photos')
    .doc(route.params.postid)
    .collection('comment')
    .get()

    const allcomments = querySanp.docs.map(docSnap=>docSnap.data())
    setCommentData(allcomments)
      
    
  }
  const SubmitComment = async () => {
    

    const querySanp = await firestore()
    .collection('Albums')
    .doc(route.params ? route.params.uid : user.uid)
    .collection('groups')
    .doc(route.params.foldername)
    .collection('photos')
    .doc(route.params.postid)
    .collection('comment')
    .add({
  
      username : userData.name,
      userimg : userData.userImg,
      comment : comment,
      commentTime: firestore.Timestamp.fromDate(new Date()),
      uid : firebase.auth().currentUser.uid,
      commentCount : 1
    })
    .then(() => {
    firestore()
    .collection('Albums')
    .doc(route.params ? route.params.uid : user.uid)
    .collection('groups')
    .doc('전체사진')
    .collection('photos')
    .doc(route.params.postid)
    .collection('comment')
    .add({
  
      username : userData.name,
      userimg : userData.userImg,
      comment : comment,
      commentTime: firestore.Timestamp.fromDate(new Date()),
      uid : firebase.auth().currentUser.uid,
      
    })
    .then(() => {
         
      firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        point :  userData.point + 5
      })
  })
      console.log('Groups Added!');
      setDeleted(true);
      Alert.alert('댓글 작성 완료!')

     
        
   

      
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }
  const DeleteCommentCheck = (item) => {
    Alert.alert(
      '댓글을 삭제합니다',
      '확실합니까?',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed!'),
          style: '취소',
        },
        {
          text: '확인',
          onPress: () => DeleteComment(item),
        },
      ],
      {cancelable: false},
    );
  };
  const addCollection =  firestore()
  .collection('Albums')
  .doc(route.params ? route.params.uid : user.uid)
  .collection('groups')
  .doc(route.params.foldername)
  .collection('photos')
  .doc(route.params.postid)
  .collection('comment');

  const addAllCollection =  firestore()
  .collection('Albums')
  .doc(route.params ? route.params.uid : user.uid)
  .collection('groups')
  .doc('전체사진')
  .collection('photos')
  .doc(route.params.postid)
  .collection('comment');

  const DeleteComment =  async (item) => {
    
 
    try {
      const rows = await addCollection.where('comment', '==', item.comment);
      const Allrows = await addAllCollection.where('comment', '==', item.comment);

      rows.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()

      
      
        });
      });

      Allrows.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()

      
      
        });
      }) .then(() => {
      setDeleted(true);

      Alert.alert(
        '댓글 삭제 완료!',
        );

      console.log('Delete Complete!', rows);
    })
    } catch (error) {
      console.log(error.message);
    }
  };

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
  useEffect(() => {
    getComment();
    getUser();
    setDeleted(false);
  }, [deleted,refreshing]);
  



  const RenderCard = ({item})=>{
    return (
      <View style={styles.row}>
        <View style={styles.conversation}> 
        
      <TouchableOpacity 
            onPress={() => setModalVisible()}
            style={[styles.imageContainer]}>
            <Image source={{ uri: item.userimg }} style={styles.img} />
          </TouchableOpacity>
          <View style={{
              flex: 1,
              justifyContent: 'center'
            }}>
            <View style={{
              flexDirection: 'row',

            }}>
              <Text numerOfLine={1} style={styles.username}>{item.username}</Text>
              {(() => {
          if (item.uid === firebase.auth().currentUser.uid)    
           return <TouchableOpacity onPress={() => DeleteCommentCheck(item)}>
                    <Ionicons style={styles.delete}name="close-circle" size={25} color="gray" /> 
                  </TouchableOpacity>
                })()}
              
            </View>
            <View style={{
              flexDirection: 'row',
            }}>
              <Text style={styles.message}>{item.comment}</Text>
              
            </View>
            <View style={{
              flexDirection: 'row',
            }}>
              <Text style={styles.message}>{moment(item.commentTime.toDate()).fromNow()}</Text>
              
            </View>
            </View>
            
            
            </View>
            </View>
        
        
        
       
    )
}
    return (
      <View style={styles.container}>
         <View style={styles.row}>
         <Ionicons name="chatbubble-ellipses" size={25} color="gray" /> 
         <Text style={{marginBottom : 20, marginLeft : 10, fontSize : 18,fontFamily : 'Jalnan'}}><Text style={{color : 'black', fontWeight : 'bold',}}>{CommentData.length}</Text>개의 댓글이 있어요</Text>
       
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
      
        
        <View style={{flexDirection : 'row'}}>
      <TextInput
            style={styles.textInput}
            value={comment}
            onChangeText={(text) => {setComment(text)}}
            placeholder="댓글을 남겨보세요."
          />
          
          <TouchableOpacity onPress={() => SubmitComment()}>
          <Text style ={{color : 'black',fontFamily :  'Jalnan', paddingHorizontal: 10, marginTop : 10, fontSize : 18}}>작성</Text>
          </TouchableOpacity>
      
        </View>
  
        </View>
        
        
    
  );
};

export default Comment;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding : 20
      
     
    },

    folderContainer :{
      flexDirection: 'row', // 혹은 'column'
      marginBottom: 15,
    },
    titleConainer:{
      flexDirection: 'column', // 혹은 'column'
    },
    conversation: {
      flexDirection: 'row',
      paddingBottom: 25,
      paddingRight: 20,
      paddingTop : 20,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      
      borderColor: '#D3D3D3',
  },
      
    title:{
      flexDirection: 'row', // 혹은 'column'
      flex: 1,
    },
    miniroom: {
      width:'100%', 
      height:150,
      justifyContent: 'space-around',
      alignItems:'center',
      marginTop: 30,
      paddingVertical: 8,
      paddingHorizontal: 12,

    

    },
    img:{width:60,height:60,borderRadius:30,backgroundColor:"orange"},
    username: {
      fontSize: theme.fontSize.title,
      color: theme.colors.title,
      width: 210,
      fontFamily : 'Jalnan'
    },
    delete: {
      fontSize: theme.fontSize.title,
      color: theme.colors.title,
      width: 210,
      marginLeft : 20,
      fontSize : 30
    },
    message: {
      fontSize: theme.fontSize.message,
      width: 240,
      color: theme.colors.subTitle,
      marginTop : 5,
      fontFamily : 'Jalnan'
    },
    imageContainer: {
      marginRight: 15,
      borderRadius: 25,
      height: 50,
      width: 50,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center' 
    },
    textInput: {
      marginBottom: 10,
      borderBottomWidth :1,
      borderBottomColor: 'orange',
      borderColor:'rgba(0,0,0,0)',
      height: 45,
      width : 300,
      fontFamily:'Jalnan',
      fontSize:16,
      borderWidth: 1
    },
    showText: {
      marginTop: 10,
      fontSize: 25,
    },
    time: {
      fontSize:15,
      color: 'black'
    },
  });