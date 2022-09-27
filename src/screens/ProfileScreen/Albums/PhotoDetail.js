import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity,TextInput,Dimensions,RefreshControl,Alert,TouchableWithoutFeedback} from 'react-native'
import React, {useState, useEffect, useContext,useCallback} from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import firebase  from '@react-native-firebase/app';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import useStore from '../../../../store/store'

var { height, width } = Dimensions.get('window');

const PhotoDeatil = ({route,navigation}) => {
  const {PhotoName,Body,Post} = useStore();

  const [refreshing, setRefreshing] = useState(false);
  const [posts,setPosts] = useState([])
  const [deleted, setDeleted] = useState(false);
  const {uid} = route.params
  const [CommentData, setCommentData] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(null);

  const handleLiked = (item) => {
    !isLiked
      ? setNumberOfLikes(item.numberOfLikes + 1)
      : setNumberOfLikes(item.numberOfLikes - 1);
    setIsLiked(!isLiked);
  };
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const getPosts = async ()=>{
    const querySanp = await firestore().collection('Albums')
    .doc(route.params ? route.params.uid : user.uid)
    .collection('groups')
    .doc(route.params.foldername)
    .collection('photos')
    .orderBy('postTime', 'desc')
    .get()
    const allposts = querySanp.docs.map(docSnap=>docSnap.data())
   //  console.log(allusers)
   console.log('Posts: ', posts );
   setPosts(allposts)
   
}
const DeletePhotoCheck = (item) => {
    Alert.alert(
      '사진을 삭제합니다',
      '확실합니까? 삭제할시 소중한 추억들이 삭제 됩니다. 다시한번 확인 해주세요.' ,
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed!'),
          style: '취소',
        },
        {
          text: '확인',
          onPress: () => DeletePhoto(item),
        },
      ],
      {cancelable: false},
    );
  };
  const addCollection =  firestore()
  .collection('Albums')
  .doc(firebase.auth().currentUser.uid)
  .collection('groups')
  .doc(route.params.foldername)
  .collection('photos');

  const addAllCollection =  firestore()
  .collection('Albums')
  .doc(firebase.auth().currentUser.uid)
  .collection('groups')
  .doc('전체사진')
  .collection('photos');

  const DeletePhoto =  async (item) => {
    
    try {
      const rows = await addCollection.where('post', '==', item.post);
      const Allrows = await addAllCollection .where('post', '==', item.post);

      rows.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()

      
      
        });
      });

      Allrows.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()

      
      
        });
      });
      
      Alert.alert(
        '사진 삭제 완료!',
        );

      setDeleted(true);
      console.log('Delete Complete!', rows);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getComment = async(item) => {
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
  
useEffect(()=>{
    getPosts();
    getComment();
    setDeleted(false);
}, [deleted,refreshing]);

const RenderCard = ({item})=>{
    return (
        <View style={styles.container}>
        <View style={styles.title2}>
        <Text style={{fontSize : 20, fontFamily: 'Jalnan', padding : 5}}> {item.post}</Text>
        
        {(() => { 
      if (route.params.uid === firebase.auth().currentUser.uid)    
      return  <TouchableOpacity style={{marginLeft: 15, justifyContent : 'center'}} onPress={() => DeletePhotoCheck(item)}>
        <View style={{marginRight :15}}>
         <Ionicons name="trash" size={25} color="black" />
        </View>
        </TouchableOpacity>
         })()} 
        </View>
            
        <Image source={{uri: item.img}} style={styles.postImg} />
        <Text style={{fontSize : 20, fontFamily: 'Jalnan', padding : 5}}> {item.body}</Text>
        <View style={styles.row}>
        <Text style={{fontSize : 20, fontFamily: 'Jalnan', padding : 5, marginBottom : 10}}> {moment(item.postTime.toDate()).fromNow()}</Text>
        
        </View>
        <View style={styles.row2}>
        <View style={styles.title3}>
        
         <View style={{marginTop : 23, marginBottom : 15}}>
        </View>
        <TouchableOpacity style={{justifyContent : 'center'}} onPress={() => navigation.navigate('Comment',{uid : uid, postid: item.postid, name : item.post, foldername : route.params.foldername } )}>
         
         <View style={{padding : 10  ,marginTop : 10, marginBottom : 15}}>
          <Ionicons name="chatbubble-ellipses" size={25} color="gray" />
         </View>
         </TouchableOpacity>
         <View style={{marginTop : 23, marginBottom : 15}}>
         <TouchableOpacity style={{}} onPress={() => navigation.navigate('Comment',{uid : uid, postid: item.postid, name : item.post, foldername : route.params.foldername} )}>  
        <Text style={{fontSize : 17, fontFamily: 'Jalnan'}}>댓글</Text>
        </TouchableOpacity>
        </View>
        
        </View>
        
        </View> 

        
          </View>
         
      )
  }

    return (
      <View style={styles.container}>
        <View style={styles.title}>

          <TouchableOpacity style={{marginLeft: 15, justifyContent : 'center'}} onPress={() => navigation.goBack()}>
         
        
         <Ionicons name="arrow-back" size={25} color="black" />
        
        </TouchableOpacity>
        <View style={{ justifyContent : 'center', marginLeft: 120}}>
        <View style={styles.folderContainer}>
      <Icon name="folder"  size={23} color="orange"/>
      <Text style={{fontSize : 18,fontFamily : "Jalnan"}}> {route.params.foldername}</Text>
        
        
        
        </View>
            </View>
        </View>
    
        <FlatList 
          data={posts}
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

export default PhotoDeatil;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
     
    },


    padding: {
        padding : 20,
        backgroundColor: '#fff',
        
       
      },
    folderContainer :{
      flexDirection: 'row', // 혹은 'column'
     
      
    },
    titleConainer:{
      flexDirection: 'column', // 혹은 'column'
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
    title:{ 
        height:50,
        backgroundColor: 'white',
        flexDirection: 'row', 
        
       
      },
      title2:{ 
        
        justifyContent: 'space-between',
        flexDirection: 'row', 
        marginBottom : 5,
       
      },

      title3:{ 
        
        
        flexDirection: 'row', 
        
       
      },
      postImg: {
        height: Dimensions.get('screen').height / 3,
        width: Dimensions.get('screen').width,
        
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        
        borderColor: '#D3D3D3',
    },
    row2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 30,
        marginBottom : 30,
        
        borderColor: '#D3D3D3',
    },
  });