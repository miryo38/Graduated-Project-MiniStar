import React, {useEffect, useState, useCallback} from 'react';
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
  Dimensions,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import PostCard from '../../../utils/PostCard';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import {Container} from '../../../../styles/FeedStyles';
import {AuthContext} from '../../utils/AuthProvider';
import useStore from '../../../../store/store';
import Loading from '../../../utils/Loading';
import {useNavigation} from '@react-navigation/native';

const ReportScreen = ({props}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [currentUserLike, setCurrentUserLike] = useState(false);
  const [ready, setReady] = useState(true);
  const [Bestposts, setBestPosts] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getBestPosts = async () => {
    const querySanp = await firestore()
      .collection('posts')
      .orderBy('likes', 'desc')
      .limit(5)
      .get();
    const allposts = querySanp.docs.map(docSnap => docSnap.data());
    //  console.log(allusers)
    setBestPosts(allposts);
  };

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('ReportPost')
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            const {
              uid,
              userimg,
              post,
              postTime,
              postimg,
              name,
              postid,
              report,
            } = doc.data();
            list.push({
              id: doc.id,
              uid,
              postTime: postTime,
              userimg,
              postimg,
              post,
              name,
              postid,
              report,
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
    setTimeout(() => {
      setReady(false);
    }, 1000);
    fetchPosts();
    setDeleted(false);
    getBestPosts();
  }, [deleted, refreshing, isFocused]);

  const handleDelete = (postId, userId, report) => {
    Alert.alert(
      '글 삭제하기',
      '확실합니까?',
      [
        {
          text: '아니오',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: '예',
          onPress: () => deletePost(postId, userId, report),
        },
      ],
      {cancelable: false},
    );
  };

  const deletePost = (postId, userId, report) => {
    console.log('Current Post Id: ', postId);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} 성공적으로 삭제되었습니다.`);
                deleteFirestoreData(postId, userId, report);
              })
              .catch(e => {
                console.log('Error while deleting the image. ', e);
              });
            // If the post image is not available
          } else {
            deleteFirestoreData(postId, userId, report);
          }
        }
      });
  };

  const deleteFirestoreData = (postId, userId, report) => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        firestore().collection('ReportPost').doc(postId).delete();

        firestore()
          .collection('ReportRecord')
          .doc(userId)
          .collection('ReportTime')
          .add({
            postTime: firestore.Timestamp.fromDate(new Date()),
            report: report,
          });

        Alert.alert(
          '글이 삭제되었습니다.',
          '신고 게시물이 성공적으로 삭제되었습니다!',
        );
        setDeleted(true);
      })
      .catch(e => console.log('Error deleting posst.', e));
  };

  const RenderCard = ({item}) => {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.nameContainer}>
              <Image source={{uri: item.userimg}} style={styles.personImage} />
              <View>
                <TouchableOpacity>
                  <Text style={styles.personName}> {item.name} </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Image source={{uri: item.postimg}} style={styles.postImg} />
          <View style={{marginTop: 10, marginLeft: 10}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontFamily: 'Jalnan'}}>{item.post}</Text>
              <View style={{marginRight: 10}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UserPointReportScreen', {
                      uid: item.uid,
                      name: item.name,
                    })
                  }>
                  <Ionicons name="md-sad-outline" size={23} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.uid, item.report)}>
                  <Ionicons name="trash" size={23} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{marginTop: 10, fontFamily: 'Jalnan', color: 'red'}}>
              신고 사유 : {item.report}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };
  return ready ? (
    <Loading />
  ) : (
    <FlatList
      data={posts}
      renderItem={({item}) => {
        return <RenderCard item={item} />;
      }}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default ReportScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 6,
    marginStart: 10,
    marginEnd: 10,
    alignItems: 'center',
  },

  nameContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personImage: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  postImg: {
    height: Dimensions.get('screen').height / 3,
    width: Dimensions.get('screen').width,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'orange',
    fontFamily: 'Jalnan',
    fontSize: 20,
  },

  personName: {
    color: 'red',
    marginStart: 10,
    fontFamily: 'Jalnan',
  },
});
