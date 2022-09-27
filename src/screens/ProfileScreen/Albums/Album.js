import { View, Text,TouchableOpacity,StyleSheet,FlatList} from 'react-native';
import React, {useState, useEffect, useContext,useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import firebase  from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/Ionicons'
import useStore from '../../../../store/store'
import { useIsFocused } from '@react-navigation/native';

const Album = ({navigation,route}) => {
  const [FolderData, setFolderdData] = useState(null);
  const [Name, setName] = useState('');
  const {FolderName} = useStore();
  const name = route.params.name
  const isFocused = useIsFocused();

  const getFolder = async() => {
    const querySanp = await firestore()
    .collection('Albums')
    .doc(route.params ? route.params.uid : user.uid)
    .collection('groups').orderBy('postTime')
    .get()

    const allfolders = querySanp.docs.map(docSnap=>docSnap.data())
    setFolderdData(allfolders)
      
    
  }

  useEffect(() => {
    getFolder();
  }, [FolderName,isFocused]);
  const {uid} = route.params

  const RenderCard = ({item})=>{
    return (
     
        <TouchableOpacity style={styles.folderContainer} onPress={() => navigation.navigate('Photos',{uid : uid,name :route.params.name, fname : item.name } )}>
        <Icon name="folder"  size={23} color="orange"/>
      <Text style={{fontSize : 18,fontFamily: "Jalnan"}}> {item.name}</Text>
      </TouchableOpacity>
      
        
        
        
       
    )
}
    return (
      <View style={styles.container}>
        
        <View style={styles.folderContainer}>

      
        
        
        </View>
        
        <FlatList 
          data={FolderData}
          renderItem={({item})=> {return <RenderCard item={item} />
        
        }}
        />
      
        
        
      {(() => { 
      if (route.params.uid === firebase.auth().currentUser.uid)    
      return  <Icon style={styles.fab} name="settings"  size={23} color="black" onPress={() => navigation.navigate('AlbumSetting',{uid : uid,name :route.params.name }  )}/>
      })()} 
  
        </View>
        
        
    
  );
};

export default Album;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      
     
    },

    folderContainer :{
      flexDirection: 'row', // 혹은 'column'
      marginBottom: 15,
    },
    titleConainer:{
      flexDirection: 'column', // 혹은 'column'
    },
    fab: {
      position: 'absolute',
      margin: 25,
      right: 0,
      bottom: 0,
      backgroundColor:"white"
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
  });