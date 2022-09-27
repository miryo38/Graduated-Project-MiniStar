import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity,TextInput,Dimensions} from 'react-native'
import React,{useState,useEffect,useContext} from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import firebase  from '@react-native-firebase/app';
import ActionButton from 'react-native-action-button';
import useStore from '../../../../store/store'
import { useIsFocused } from '@react-navigation/native';

var { height, width } = Dimensions.get('window');

const Photos = ({route,navigation}) => {
  const {PhotoName,Body,Post} = useStore();
  const [posts,setPosts] = useState([])
  const isFocused = useIsFocused();
  const {uid} = route.params
  const getPosts = async ()=>{
    const querySanp = await firestore().collection('Albums').doc(route.params ? route.params.uid : user.uid).collection('groups').doc(route.params.fname).collection('photos').orderBy('postTime', 'desc').get()
    const allposts = querySanp.docs.map(docSnap=>docSnap.data())
   //  console.log(allusers)
   console.log('Posts: ', posts );
   setPosts(allposts)
   
}

useEffect(()=>{
    getPosts()
},[PhotoName,Post,Body,isFocused])

const RenderCard = ({item})=>{
    return (
      <TouchableOpacity 
      onPress={() => navigation.navigate('PhotoDetail',{uid : uid, foldername : route.params.fname} )}>
      <View  style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }]}>
      <Image 
      style={{
          flex: 1,
          alignSelf: 'stretch',
          width: undefined,
          height: undefined,
          backgroundColor: '#c2c2c2'
      }}
      source={{uri: item.img}}
      />
    
      </View>
      </TouchableOpacity>
    )
}
    return (
      <View style={styles.container}>
          <View style={styles.padding}>

        <TouchableOpacity>
        <View style={styles.folderContainer}>
      <Icon name="folder"  size={23} color="orange"/>
      <Text style={{fontSize : 18,fontFamily: 'Jalnan'}}> {route.params.fname}</Text>
        
        
        
        </View>

        </TouchableOpacity>

        <View style={styles.titleConainer}>
      
      <Text style={{fontSize : 25,fontFamily: 'Jalnan'}}>{route.params.name} 님의 사진첩</Text>

      <Text style={{color : '#129fcd', fontSize : 20,fontFamily: 'DungGeunMo',marginTop : 5,}}>{posts.length}</Text>
        
        </View>
        
        </View>

        <FlatList 
          data={posts}
          horizontal={false}
          numColumns={3}
          renderItem={({item})=> {return <RenderCard item={item} />
        }}
         
        />
        {(() => {
        if (route.params.fname !== "전체사진" && route.params.uid === firebase.auth().currentUser.uid)    
        return <ActionButton buttonColor="#FF6347" onPress={() => navigation.navigate('AddPhotos',{uid : uid, foldername : route.params.fname} )}/>
      
      })()}
        
        </View>
        
        
    
  );
};

export default Photos;
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
      marginBottom: 15,
      marginTop : 30,
    },
    titleConainer:{
      flexDirection: 'column', // 혹은 'column'
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
    fab: {
      width:45,
      height:45,
      position: 'absolute',
      margin: 25,
      right: 0,
      bottom: 0,
      borderTopLeftRadius: 30,
		  borderTopRightRadius: 30,
      borderBottomLeftRadius : 30,
      borderBottomRightRadius : 30,

      backgroundColor:"orange"
      },
  });