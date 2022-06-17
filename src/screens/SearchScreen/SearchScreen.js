import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity,TextInput,Dimensions,ScrollView} from 'react-native'
import React,{useState,useEffect,useContext} from 'react'
import SearchBar from "react-native-dynamic-search-bar";
import firestore from '@react-native-firebase/firestore'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase  from '@react-native-firebase/app';
import useStore from '../../../store/store';
import Loading from '../../utils/Loading';
import { theme } from '../../Chat/ChatTheme';
import Icon from 'react-native-vector-icons/FontAwesome';

var { height, width } = Dimensions.get('window');

const SearchScreen = ({props,navigation}) => {
  const {Post} = useStore(); // 0522새로고침용
  const [posts,setPosts] = useState(null)
  const [loading, setLoading] = useState(true);
  const [Bestposts,setBestPosts] = useState(null)
  const [ready, setReady] = useState(true)
  const {Lsearch, setLsearch,setLsearchcount,Lsearchcount}  = useStore()
  const [userData, setUserData] = useState(null);
  const [random, setRandom] = useState([]); 

  const tags = ["인물", "배경", "음식", "동물", "물건", "문화"]
  const [changepost,setchangePosts] = useState(null)
  const getRandomIndex = (length) => {
    var random =  parseInt(Math.random() * length);
    return random;
    }
    


  const getPosts = async ()=>{
    const querySanp = await firestore().collection('posts').orderBy('postTime', 'desc').get()
    const allposts = querySanp.docs.map(docSnap=>docSnap.data())
   //  console.log(allusers)
   setchangePosts(allposts)


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


const handleSearchTextChange =  async () => {
  
  try {
    const list = [];

    await firestore()
      .collection('posts')
      .where('tag', '==' , Lsearch)
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
      
      
      
    if (loading) {
      setLoading(false);
    }
  
  } catch (e) {
    console.log(e);
  }
  
};
const SubmitSearch = async () => {
    
    
  firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .update({
    Lsearch : Lsearch
  })
    setLsearchcount();  
 

    

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

const getBesttagPosts =  async () => {
  try {
    const list = [];
    
    await firestore()
      .collection('posts')
      .orderBy('likes', 'desc')
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
            postid
          });
        });
      })
     
    setchangePosts(list);

    if (loading) {
      setLoading(false);
    }

    console.log('Posts: ', posts);
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
  },[Post,Lsearchcount])

  const RenderCard = ({item})=>{
    return (
      
      <TouchableOpacity 
      onPress={() => props.navigation.navigate('SearchSnsScreen', { tag: item.tag, uid : item.uid, postimg : item.postImg, post: item.post, postTime : item.postTime })}
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
      <ScrollView>
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
         placeholder="Search"
          maxLength={10} />
			</View>
		</View>
    <TouchableOpacity onPress={handleSearchTextChange}>
    <View style={styles.serachBtn}>
    <Text style={{color : theme.colors.searchText ,}}>검색</Text>
    
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
        
          <TouchableOpacity style={styles.button2} onPress={() => getPosts()}>
              <Text style={styles.userBtnTxt2}>전체 게시물</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={() => TagList(userData ? userData.Lsearch : '')}>
              <Text style={styles.userBtnTxt2}>최근 검색어</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2} onPress={() => TagList(tags[getRandomIndex(tags.length)])}>
              <Text style={styles.userBtnTxt2}>추천 게시물</Text>
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
    width : 250,
   
		color: theme.colors.searchText
	}
});
