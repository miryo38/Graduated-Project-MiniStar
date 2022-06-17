import { View, Text,TouchableOpacity,StyleSheet,Image,SafeAreaView,Dimensions,Animated,PanResponder, ImageBackground,Button, Alert} from 'react-native';
import React,{useState,useEffect,useRef} from 'react'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import MiniroomBox from '../../../components/MiniroomBox/MiniroomBox';
import useStore from '../../../../store/store';
import firestore from '@react-native-firebase/firestore'; 
import firebase  from '@react-native-firebase/app';
import ViewShot from 'react-native-view-shot';
import storage from '@react-native-firebase/storage';
import COLORS from '../Miniroom/colors';

const initial = 'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/Background%2Fbackground1.png?alt=media&token=f59b87fe-3a69-46b9-aed6-6455dd80ba45';
const width = Dimensions.get('window').width / 2 - 30;
const tlranf = [
  {
    id:0,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F1.png?alt=media&token=05f16d97-3ecb-4e70-876a-5013d797529e'
  },
  {
    id:1,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F1.png?alt=media&token=05f16d97-3ecb-4e70-876a-5013d797529e'
  },
  {
    id:2,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F2.png?alt=media&token=d5c4f039-dd12-44f4-b4a7-2830c47f0f9a'
  },
  {
    id:3,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F3.png?alt=media&token=aeb9d714-6666-4e03-ae57-1b1b75e5f6ad'
  },
  {
    id:4,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F4.png?alt=media&token=c389d522-673f-41e1-8187-2d28c5893538'
  },
  {
    id:5,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F5.png?alt=media&token=02bcfaa9-a313-4568-8d1a-e7603a580578'
  },
  {
    id:6,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F6.png?alt=media&token=e3a9f6af-8c79-44ac-a8d2-7c4c2fc06754'
  },
  {
    id:7,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F7.png?alt=media&token=627aa75a-9f3d-49b6-bd95-486087f3d39a'
  },
  {
    id:8,
    address:'https://firebasestorage.googleapis.com/v0/b/graduated-project-ce605.appspot.com/o/newAnimals%2F1.png?alt=media&token=05f16d97-3ecb-4e70-876a-5013d797529e'
  },
]

const Miniroom = () => {  
  const usersBackgroundCollection = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('background').doc(firebase.auth().currentUser.uid+ 'mid');
  const usersMinimeCollection = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('minime').doc(firebase.auth().currentUser.uid+ 'mid');
  const usersToolCollection = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('tool'); 
  const usersMinipatCollection = firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('minipat').doc(firebase.auth().currentUser.uid+ 'mid');

  const InventoolCollection = firestore().collection('Inventory').doc(firebase.auth().currentUser.uid).collection('tool'); 
  const InvenminimeCollection = firestore().collection('Inventory').doc(firebase.auth().currentUser.uid).collection('minime');
  const InvenBackgroundCollection = firestore().collection('Inventory').doc(firebase.auth().currentUser.uid).collection('background');
  const InvenMinipatCollection = firestore().collection('Inventory').doc(firebase.auth().currentUser.uid).collection('minipat');
  const {tooladdress,Backaddress,BuyItem,placeX,countItem,isMinime,settooladdress,setcountItem,setBacksaddress,setisMinime} = useStore();
  const [tool, setTool] = useState();
  const [Minime, setMinime] = useState(null);
  const [Back, setBack] = useState(null);
  const [Minipat, setMinipat] = useState(null);

  const captureRef = useRef();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const categories = ['가구', '미니미', '배경','미니펫'];

  const [InvenMinime, setInvenMinime] = useState();
  const [InvenBackground, setInvenBackground] = useState();
  const [InvenTool, setInvenTool] = useState();
  const [InvenMinipat, setInvenMinipat] = useState();
  
  const [MinipatCount, setMinipatCount] = useState(0);
  //const {MinipatCount,setMinipatCount} = useStore();
  const onMinipatPress = () => {
    if(MinipatCount<8) //물주는 횟수
    {
      setMinipatCount(MinipatCount+1)  
       }
      else {
        if(MinipatCount==8){setMinipatCount(0);
        
        updateMinipat(tlranf[MinipatCount].address,MinipatCount);
      }
        Alert.alert(
        '알림',
        `이미 다 컸어요${MinipatCount}`,
        );
      }
      updateMinipat(tlranf[MinipatCount].address,MinipatCount);
  }

/*미니룸 보여지는곳 전용*/
const getTool = async () => {
  try {
    const datatool = await usersToolCollection.get();
    setTool(datatool._docs.map(doc => ({ ...doc.data(), id: doc.id, })));
  } catch (error) {
    console.log(error.message);
  }
};
const getMinime = async () => {
  try {
    const data = await usersMinimeCollection.get();
    setMinime(data._data.address);
  } catch (error) {
    console.log(error.message);
  }
};
  const getBackgroundData = async () => {
    try {
      const data = await usersBackgroundCollection.get();
      setBack(data._data.address);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getMinipatData = async () => {
    try {
      const data = await usersMinipatCollection.get();
      setMinipat(data._data.address);
      setMinipatCount(data._data.count);
    } catch (error) {
      console.log(error.message);
    }
  };
 
 
   /*미니룸 인벤 전용*/
   const getToolInven = async () => {
     try {
       const data = await InventoolCollection.get();
       setInvenTool(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
     } catch (error) {
       console.log(error.message);
     }
   };
   const addTool =(address,name) => {
    firestore().collection('miniroom').doc(firebase.auth().currentUser.uid).collection('room').doc(firebase.auth().currentUser.uid).collection('tool').doc(name).set({
      name:name,
      address:address,
      getx:1,
      gety:1});
    console.log('추가완료');
    console.log(name);
    settooladdress(address);
    setcountItem();
    console.log(countItem);
  }
   const getMinimeInven = async () => {
    try {
      const data = await InvenminimeCollection.get();
      setInvenMinime(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateMinime = (newaddress) => {
    usersMinimeCollection.update({address:newaddress});
    console.log('저장완료');  
    console.log(newaddress);
    setisMinime(newaddress);
  };
  
  const getBackgroundInven = async () => {
    try {
      const data = await InvenBackgroundCollection.get();
      setInvenBackground(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateBackground = (newaddress) => {
    usersBackgroundCollection.update({address:newaddress});
    console.log('저장완료');  
    console.log(newaddress);
    setBacksaddress(newaddress);
  }
  const getMinipatInven = async () => {
    try {
      const data = await InvenMinipatCollection.get();
      setInvenMinipat(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateMinipat = (newaddress,count) => {
    usersMinipatCollection.set({address:newaddress,count : count});
    //usersMinipatCollection.update({address:newaddress,count : count});
    
    console.log('저장완료');  
    console.log(newaddress);
    console.log('저장전',count);
    setMinipat(newaddress);
  }

   useEffect(() => {
     getBackgroundData();
     getMinime();
     getTool();
     getMinipatData();
     return () => {
       onSave();
     }
   }, []);
   useEffect(() => {
    getMinimeInven();
    getBackgroundInven();
    getToolInven();
    getMinipatInven();
  }, [BuyItem]);
   
  
  
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
    task.on('state_changed', (taskSnapshot) => {
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
      console.log('uri', url)

      setUploading(false);
      setImage(null);
      firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        miniRoom : url
      })
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
  const CategoryList = () => {
    return (
      
      <View style={styles.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => setCategoryIndex(index)}>
            <Text
              style={[
                styles.categoryText,
                catergoryIndex === index && styles.categoryTextSelected,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const Card = ({plant}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          {
            if (catergoryIndex === 0) return addTool(plant.address,plant.name);
            if (catergoryIndex === 1) return updateMinime(plant.address);
            if (catergoryIndex === 2) return updateBackground(plant.address);
            if (catergoryIndex === 3) return updateMinipat(plant.address,0);
        }
          }}>
        <View style={styles.card}>
          <View
            style={{
              height: 70,
              alignItems: 'center',
              justifyContent:'center',
            }}>
            <Image
              source={{uri:plant.address}}
              style={{flex: 1, resizeMode: 'contain',aspectRatio: 1.0,}}
            />
          </View>          
        </View>
      </TouchableOpacity>
    );
  };

  return (

    <View style={{flex:1}}>
              

    <ViewShot style ={{flex : 1}} ref={captureRef} options={{ format: 'jpg', quality: 0.9 }}>

    <View style={{flex:1,width:'100%',height:'100%'}}>


          <ImageBackground style={styles.background} source={{uri:`${Back ? Back : initial}`}}></ ImageBackground>

              </View>
          < Image style={styles.minime} source={{uri:`${Minime ? Minime : initial}`}}></ Image>
          
          <TouchableOpacity style={styles.minipat} onPress={onMinipatPress}>
          < Image style={{borderWidth:1,flex:1}} source={{uri:`${Minipat ? Minipat : initial}`}}></ Image>
          </TouchableOpacity>
            <View style={styles.item}>
            {
        tool?.map((row, idx) => {
         {
            return  <MiniroomBox test={row.address} name={row.name} x={row.getx} y={row.gety}></MiniroomBox>} 
      })
      }
            </View>
            </ViewShot>
            <SafeAreaView
      style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.white}}>
                        <View style={{alignItems:'flex-end'}}>
                        <Text style={{fontSize: 16, color: 'grey', fontFamily : "Jalnan"}}>물 준  횟수 : {MinipatCount.valueOf()}</Text>
                        </View>
            <CategoryList />
            <FlatList
        columnWrapperStyle={{justifyContent: 'flex-start'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        numColumns={4}
        data={
          (function() {
            if (catergoryIndex === 0) return InvenTool;
            if (catergoryIndex === 1) return InvenMinime;
            if (catergoryIndex === 2) return InvenBackground;
            if (catergoryIndex === 3) return InvenMinipat;
          })()
        }
        renderItem={({item}) => {
          return <Card plant={item} />;
        }}
      />
        </SafeAreaView>
    </View>
    
  ); 
};

export default Miniroom;
const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode:'stretch',
      position: 'absolute',
      height: '100%',
      weight: '100%',
      opacity: 0.8,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    item: {
      position: 'absolute',

    },
    minime: {
      resizeMode:'stretch',
      position: 'absolute',
      transform: [{translateX: 150} , {translateY:200}],
      width:100,
      height:100,
    },
    minipat: {
      resizeMode:'stretch',
      position: 'absolute',
      transform: [{translateX: 350} , {translateY:220}],
      width:100,
      height:100,
    },
    categoryContainer: {
      flexDirection: 'row',
      marginTop: 30,
      marginBottom: 20,
      justifyContent: 'space-between',
    },
    categoryText: {fontSize: 16, color: 'grey', fontFamily : "Jalnan"},
    categoryTextSelected: {
      color: COLORS.orange,
      paddingBottom: 5,
      borderBottomWidth: 2,
      borderColor: COLORS.orange,
    },
    card: {
      height: 90,
      width: 90,
      backgroundColor: COLORS.light,
      marginHorizontal: 2,
      borderRadius: 10,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent:'center',
    },
    header: {
      marginTop: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    searchContainer: {
      height: 50,
      backgroundColor: COLORS.light,
      borderRadius: 10,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      color: COLORS.dark,
    },
    sortBtn: {
      marginLeft: 10,
      height: 50,
      width: 50,
      borderRadius: 10,
      backgroundColor: COLORS.green,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });