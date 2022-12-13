import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity,TextInput,Dimensions,ScrollView,RefreshControl} from 'react-native'
import React,{useState,useEffect,useContext,useCallback} from 'react'
import SearchBar from "react-native-dynamic-search-bar";
import firestore from '@react-native-firebase/firestore'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase  from '@react-native-firebase/app';
import useStore from '../../../store/store';
import Loading from '../../utils/Loading';
import { theme } from '../../Chat/ChatTheme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from '@react-navigation/native';

var { height, width } = Dimensions.get('window');

const SearchScreen = ({navigation}) => {
  const {Post} = useStore(); // 0522새로고침용
  const [loading, setLoading] = useState(true);
  const [Bestposts,setBestPosts] = useState(null)
  const [ready, setReady] = useState(true)
  const {Lsearch, setLsearch,setLsearchcount,Lsearchcount}  = useStore()
  const [userData, setUserData] = useState(null);
  const isFocused = useIsFocused();
  const tags = ["인물", "배경", "음식", "동물", "물건", "문화"]


  const [search, setSearch] = useState(null);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [changepost,setchangePosts] = useState(null)
  const [allpost,setallpost] = useState(null)
  const [Count,setCounts] = useState(null)

  const getRandomIndex = (length) => {
    var random =  parseInt(Math.random() * length);
    return random;
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
  

const getCounts = async() => {
  await firestore()
  .collection('SearchCount')
  .doc(firebase.auth().currentUser.uid)
  .get()
  .then((documentSnapshot) => {
    if( documentSnapshot.exists ) {
      console.log('User Data', documentSnapshot.data());
      setCounts(documentSnapshot.data());
    }
        
    
          
  })
  
}



const getPosts = async ()=>{
    
  const querySanp = await firestore().collection('posts').where('tag', '==' , "배경").orderBy('postTime', 'desc').get()
  const allposts = querySanp.docs.map(docSnap=>docSnap.data())
 setchangePosts(allposts)

  
}

const getAllPosts = async ()=>{
    
  const querySanp = await firestore().collection('posts').orderBy('postTime', 'desc').get()
  const allposts = querySanp.docs.map(docSnap=>docSnap.data())
  setallpost(allposts)


}
const ALlPosts =  async (tags) => {
  try {
    const list = [];
    
    await firestore().collection('posts').orderBy('postTime', 'desc').get()
      .then((querySnapshot) => {
        // console.log('Total Posts: ', querySnapshot.size);
        querySnapshot.forEach((doc) => {
          const {
            postid,
            uid,
            post,
            postImg,
            postTime,
            tag,
            likes,
            comments,
          } = doc.data();
          list.push({
            id: doc.id,
            uid,
            postid,
            postTime: postTime,
            tag,
            post,
            postImg,
            likes,
            comments,
          });
        });
      }).then(() => {
        
        setchangePosts(list);

        
      })
     

    if (loading) {
      setLoading(false);
    }

  } catch (e) {
    console.log(e);
  }
};
const getSearch = async() => {
  await firestore().collection('SearchCount')
  .doc(firebase.auth().currentUser.uid).get()
  .then((documentSnapshot) => {
    if( documentSnapshot.exists ) {
      console.log('User Data', documentSnapshot.data());
      setSearch(documentSnapshot.data());
    }
  })
}


const getBestPosts = async ()=>{
  const querySanp = await firestore()
  .collection('posts')
  .orderBy('likes', 'desc')
  .limit((5))
  .get()
  const allposts = querySanp.docs.map(docSnap=>docSnap.data())
 //  console.log(allusers)
 setBestPosts(allposts)
}
const AllBestPosts =  async (tags) => {
  try {
    const list = [];
    
    await firestore().collection('posts').where('tag', '==' , tags).orderBy('postTime', 'desc').get()
      .then((querySnapshot) => {
        // console.log('Total Posts: ', querySnapshot.size);
        querySnapshot.forEach((doc) => {
          const {
            postid,
            uid,
            post,
            postImg,
            postTime,
            tag,
            likes,
            comments,
          } = doc.data();
          list.push({
            id: doc.id,
            uid,
            postid,
            postTime: postTime,
            tag,
            post,
            postImg,
            likes,
            comments,
          });
        });
      }).then(() => {
        
        setchangePosts(list);

        
      })
     

    if (loading) {
      setLoading(false);
    }

  } catch (e) {
    console.log(e);
  }
};


const handleSearchTextChange =  async () => {
  
  try {
    const list = [];

    await firestore()
      .collection('posts')
      .where('tag', '==' , Lsearch.trim())
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
            tag,
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
            tag,
            post,
            postImg,
            liked: false,
            likes,
            comments,
          });
        });
   
      })
      setchangePosts(list);

  firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .update({
    Lsearch : Lsearch
  })

    setLsearchcount();  

  {(() => { 
    if (Lsearch === "동물")    
    return  firestore()
    .collection('SearchCount')
    .doc(firebase.auth().currentUser.uid)
    .update({
      동물 : Count.동물 + 1
    })
    else if (Lsearch === '음식'){
      return firestore()
      .collection('SearchCount')
      .doc(firebase.auth().currentUser.uid)
      .update({
        음식 : Count.음식 +1
      })
    }
    else if (Lsearch === '문화'){
      return firestore()
      .collection('SearchCount')
      .doc(firebase.auth().currentUser.uid)
      .update({
        문화 : Count.문화 +1
      })
    }
      else if (Lsearch === '배경'){
        return firestore()
        .collection('SearchCount')
        .doc(firebase.auth().currentUser.uid)
        .update({
          배경 : Count.배경 +1
        })
      }
      else if (Lsearch === '인물'){
        return firestore()
        .collection('SearchCount')
        .doc(firebase.auth().currentUser.uid)
        .update({
          인물 : Count.인물 +1
        })
      }
        else if (Lsearch === '물건'){
          return firestore()
          .collection('SearchCount')
          .doc(firebase.auth().currentUser.uid)
          .update({
            물건 : Count.물건 +1
          })
        }
        

        })()} 

        
        const searchs =[search.인물,search.배경,search.음식,search.동물,search.물건,search.문화]
        var maxnum2 = 0;
        var maxnumT2 = '';
          for (let i = 0; i < tags.length; i++) {
            if (searchs[i] > maxnum2) {
              maxnum2 = searchs[i]
              //setmaxnum(searchs[i])
              maxnumT2 =tags[i]
              console.log(maxnum2)
              console.log(maxnumT2)
           
            }
          }
          
   firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .update({
    InterSearch : maxnumT2
  })
      
    if (loading) {
      setLoading(false);
    }
  
  } catch (e) {
    console.log(e);
  }
  
};



const TagList =  async (tags) => {
  try {
    const list = [];
    
    await firestore()
      .collection('posts')
      .where('tag', '==' , tags)
      .orderBy('postTime', 'desc')
      .get()
      .then((querySnapshot) => {
        // console.log('Total Posts: ', querySnapshot.size);
        querySnapshot.forEach((doc) => {
          const {
            postid,
            uid,
            post,
            postImg,
            postTime,
            tag,
            likes,
            comments,
          } = doc.data();
          list.push({
            id: doc.id,
            uid,
            postid,
            postTime: postTime,
            tag,
            post,
            postImg,
            likes,
            comments,
          });
        });
      }).then(() => {
        
        setchangePosts(list);

        
      })
     

    if (loading) {
      setLoading(false);
    }

  } catch (e) {
    console.log(e);
  }
};





useEffect(()=>{
  setTimeout(()=>{
    setReady(false)
    },1000)
    getPosts()
    getBestPosts()
    getUser()
    getRandomIndex()
    getCounts()
    getAllPosts()
    getSearch()
    
  },[Post,isFocused])

  const RenderCard = ({item})=>{
    return (
      
      <TouchableOpacity 
      onPress={() => navigation.navigate('SearchSnsScreen', { tag: item.tag, uid : item.uid, postimg : item.postImg, post: item.post, postTime : item.postTime })}
      >
      <View  style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }]}>
      <Image 
      style={{
          flex: 1,
          alignSelf: 'stretch',
          width: undefined,
          height: undefined,
          backgroundColor: '#c2c2c2'
      }}
      source={{uri: item.postImg}}
      />
    
      </View>
      </TouchableOpacity>
    )
}




  return (
    
    ready ? <Loading/> :  (
      <ScrollView contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
    <View style={{ backgroundColor: 'white', flex: 1 }}>
    <View style={styles.serach}>
    <TouchableOpacity style={{marginTop : 6,marginLeft : 5}} onPress={() => getPosts()}>
         
         <Ionicons name="arrow-back" size={25} color="black" />

        </TouchableOpacity>
        <View style={styles.container}>
			<View style={styles.row}>
				<Icon name="search" size={20} color={theme.colors.searchIcon} />
				<TextInput style={styles.input}
         onChangeText={(text) => {setLsearch(text)}}
         placeholder="검색어를 입력하세요"
          maxLength={10} />
			</View>
		</View>
    <TouchableOpacity onPress={handleSearchTextChange}>
    <View style={styles.serachBtn}>
    <Text style={{color : '#696969' , fontFamily : 'Jalnan'}}>검색</Text>

    </View>
    </TouchableOpacity>
    </View>
   
    
    <View style={{flexDirection : 'row'}}>
    <Text style={{fontSize : 20, marginLeft : 5, fontFamily : 'Jalnan',marginTop : 5, color : 'orange'}}>🎉인기 게시물 Top 5🎉  </Text>

          </View>
    <View style={{flexDirection : 'row', marginBottom : 10}}>
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator = {false}>
    {
        Bestposts?.map((row, idx) => {
          return (
            <View>
              <TouchableOpacity 
              onPress={() => navigation.navigate('SerachBestSnsScreen', { uid : row.uid, postimg : row.postImg, post: row.post, postTime : row.postTime })}
              >
              <Image source ={{uri:row.postImg}} style={{width:200,height:150,marginLeft : 10}} ></Image>
              </TouchableOpacity>
              </View>
        
          )  ;      
         
      })
      }
      </ScrollView>
    </View>
    <View style={{flexDirection : 'row',marginBottom : 5}}>
    <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator = {false}>
        
          <TouchableOpacity style={styles.button2} onPress={() => ALlPosts()}>
              <Text style={styles.userBtnTxt2}>전체 게시물</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={() => TagList(userData ? userData.Lsearch : '동물')}>
              <Text style={styles.userBtnTxt2}>최근 검색어</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2} onPress={() => AllBestPosts(userData ? userData.InterSearch : '동물')}>
              <Text style={styles.userBtnTxt2}>관심 게시물</Text>
          </TouchableOpacity>

          </ScrollView>
    </View>
    <View style={{marginTop : 10}}>
      
    <FlatList 
          data={changepost}
          horizontal={false}
          numColumns={3}
          renderItem={({item})=> {return <RenderCard item={item} />
        }}
         
        />
        
        </View>
        
    </View>
    </ScrollView>
    )
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  serach: {
    flexDirection : 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  textInput: {
    marginLeft : 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 35,
    width : 250,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1
  },
  button: {
    marginLeft : 10,
    marginRight : 8,
    width: 50,
    height: 30,
    backgroundColor: "#orange",
    borderColor: 'orange',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomColor:'#fff',
    justifyContent: "center",
    alignItems: "center"
  },
  button2: {
    marginLeft : 10,
    marginRight : 8,
    width: 100,
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

    color: '#3e3e3e',

    color: '#fff',

    textAlign:'center',  
    fontSize:15,
  },
  serachBtn: {
    marginLeft : 10,
    width: 50,
    height: 35,
    backgroundColor: theme.colors.searchBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  userBtnTxt2: {
    fontFamily: "Jalnan",
    color: '#fff',
    textAlign:'center',  
    fontSize:15,
  },
  container: {
	
	},
	row: {
		backgroundColor: theme.colors.searchBackground,
		flexDirection: 'row',
		borderRadius: 5,
		height: 35,
		alignItems: 'center',
		paddingHorizontal: 10,
    marginLeft : 10
	},
	input: {
		fontSize: 15,
		height: 45,
    width : 230,
   
		color: theme.colors.searchText
	}
});