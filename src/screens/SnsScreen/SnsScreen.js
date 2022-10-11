import React, {useEffect, useState,useCallback,useRef} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  RefreshControl,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import PostCard from '../../utils/PostCard';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import  firebase from '@react-native-firebase/app';
import {Container} from '../../../styles/FeedStyles';
import { AuthContext } from '../../utils/AuthProvider';
import useStore from '../../../store/store';
import Loading from '../../utils/Loading';
import { useNavigation } from "@react-navigation/native";
import BottomSheet from 'reanimated-bottom-sheet';
import { theme } from '../../Chat/ChatTheme';

const SnsScreen = ({props}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [currentUserLike, setCurrentUserLike] = useState(false)
  const {Post,SnsDotsRef,setSnsDotsRef} = useStore(); // 0522새로고침용
  const [ready, setReady] = useState(true)
  const [Bestposts,setBestPosts] = useState(null)
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const sheetRef = useRef(null);
  const [Username, setUsername]  = useState(null);

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 450,
      }}
    >
      <Text>Swipe down to close</Text>
    </View>
  );
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
    
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

  const fetchPosts = async () => {
    try {
      const list = [];

      
      await firestore()
        
      .collection("posts")
      .orderBy('postTime', 'desc')
      .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              name,
              post,
              uid,
              postImg,
              postTime,
              likes,  
              comments,
              postid,
            } = doc.data();
            list.push({
              name,
              id: doc.id,
              uid,
              postTime: postTime,
              postImg,
              post,
              liked: false,
              likes,
              postid,
              comments,
            });
          });
        });

      setPosts(list);
      
      if (loading) {
        setLoading(false);
      }

    
    } catch (e) {
      console.log(e);
    }
  };
  const SearchName = async () => {
    try {
      const list = [];

      
      await firestore()
        
      .collection("posts")
      .where("name", "==", Username)
      .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              name,
              post,
              uid,
              postImg,
              postTime,
              likes,  
              comments,
              postid,
            } = doc.data();
            list.push({
              name,
              id: doc.id,
              uid,
              postTime: postTime,
              postImg,
              post,
              liked: false,
              likes,
              postid,
              comments,
            });
          });
        });

      setPosts(list);
      
      if (loading) {
        setLoading(false);
      }

    
    } catch (e) {
      console.log(e);
    }
  };



  useEffect(() => {
    setTimeout(()=>{
      setReady(false)
      },1000)   
    fetchPosts();
    setDeleted(false);
    getBestPosts();
  }, [deleted,refreshing,Post,isFocused]);

  const handleDelete = (postId) => {
    Alert.alert(
      '글 삭제하기',
      '확실합니까?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };

  const deletePost = (postId) => {
    console.log('Current Post Id: ', postId);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} 성공적으로 삭제되었습니다.`);
                deleteFirestoreData(postId);
              })
              .catch((e) => {
                console.log('Error while deleting the image. ', e);
              });
            // If the post image is not available
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const deleteFirestoreData = (postId) => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          '글이 삭제되었습니다.',
          '당신의 글이 성공적으로 삭제되었습니다!',
        );
        setDeleted(true);
      })
      .catch((e) => console.log('Error deleting posst.', e));
  };


 
  return (
    ready ? <Loading/> :  (
      
<ScrollView style={{flex: 1}} 
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <Container>
          <Text style={{fontSize : 20, marginLeft : 5, fontFamily : 'Jalnan',marginTop : 5, color : 'orange'}}>🎉인기 게시물 Top 5🎉</Text>
    <View style={{flexDirection : 'row', marginBottom : 10}}>
      
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator = {false}>
    {
        Bestposts?.map((row, idx) => {
          return (
            <View>
              <TouchableOpacity 
              onPress={() => navigation.navigate('BestSnsScreen', { uid : row.uid, postimg : row.postImg, post: row.post, postTime : row.postTime })}
              >
              <Image source ={{uri:row.postImg}} style={{width:200,height:150,marginLeft : 10}} ></Image>
              </TouchableOpacity>
              </View>
        
          )  ;      
         
      })
      }
      </ScrollView>
      
    </View>
    <View style={styles.serach}>
    <TouchableOpacity style={{marginTop : 6,marginLeft : 5}} onPress={() => fetchPosts()}>
         
         <Ionicons name="arrow-back" size={25} color="black" />

        </TouchableOpacity>
        <View style={styles.container2}>
			<View style={styles.row}>
				<Icon name="search" size={20} color={theme.colors.searchIcon} />
				<TextInput style={styles.input}
         onChangeText={(text) => {setUsername(text)}}
         placeholder=" 회원 이름 검색"
          maxLength={10} />
			</View>
		</View>
    <TouchableOpacity onPress={SearchName}>
    <View style={styles.serachBtn}>
    <Text style={{color : '#696969' , fontFamily : 'Jalnan'}}>검색</Text>

    </View>
    </TouchableOpacity>
    </View>
          <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onDelete={handleDelete}
                onPress={() =>
                  {
                  navigation.navigate('SNSProfile', {uid: item.uid})
                  }
                }
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
          <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 300, 0]}
        borderRadius={10}
        renderContent={renderContent}
      />
        </Container>
        
        </ScrollView>
    )
  );
};

export default SnsScreen;
const styles = StyleSheet.create({
  serach: {
    flexDirection : 'row',
    marginTop: 10,
    marginBottom: 10,
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
  },
  serach: {
    flexDirection : 'row',
    marginTop: 10,
    marginBottom: 10,
  },serachBtn: {
    marginLeft : 10,
    width: 50,
    height: 35,
    backgroundColor: theme.colors.searchBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});