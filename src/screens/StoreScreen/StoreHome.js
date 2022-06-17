import React,{ useState,useEffect,useContext} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions
  ,TouchableOpacity
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
import COLORS from '../StoreScreen/colors';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../utils/AuthProvider';
import useStore from '../../../store/store';

const width = Dimensions.get('window').width / 2 - 30;

const StoreHome = ({navigation}) => {
  const usersCollection = firestore().collection('shops').doc('shopitems').collection('tool');
  const usersCollectionM = firestore().collection('shops').doc('shopitems').collection('minime');
  const usersCollectionB = firestore().collection('shops').doc('shopitems').collection('background');
  const usersCollectionP = firestore().collection('shops').doc('shopitems').collection('minipat');
  const categories = ['가구', '미니미', '배경','미니펫'];
  
  const {user, logout} = useContext(AuthContext);
  const {isPoint,setPoint} = useStore();
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const [tool, setTool] = useState();
  const [minime, setminime] = useState();
  const [Background, setBackground] = useState();
  const [Minipat, setMinipat] = useState();
  const [userData, setUserData] = useState(null);
  
  const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }
  const getShopData = async () => {
    try {
      const data = await usersCollection.get();
      setTool(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
      console.log('T');
    } catch (error) {
      console.log(error.message);
    }
  };
  const getShopDataM = async () => {
    try {
      const data = await usersCollectionM.get();
      setminime(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
      console.log('M');
    } catch (error) {
      console.log(error.message);
    }
  };
  const getShopDataB = async () => {
    try {
      const data = await usersCollectionB.get();
      setBackground(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
      console.log('B');
    } catch (error) {
      console.log(error.message);
    }
  };
  const getShopDataP = async () => {
    try {
      const data = await usersCollectionP.get();
      setMinipat(data._docs.map(doc => ({ ...doc.data(), id: doc.id })));
      console.log('B');
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getShopData();
    getShopDataM();
    getShopDataB();
    getShopDataP();
    getUser();
  }, []);
  useEffect(() => {
    getUser();
  }, [isPoint]);
  const CategoryList = () => {
    return (
      
      <View style={style.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => setCategoryIndex(index)}>
            <Text
              style={[
                style.categoryText,
                catergoryIndex === index && style.categoryTextSelected,
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
        onPress={() => navigation.navigate('Details', plant)}>
        <View style={style.card}>
          <View
            style={{
              height: 90,
              marginTop:15,
              alignItems: 'center',
            }}>
            <Image
              source={{uri:plant.address}}
              style={{flex: 1, resizeMode: 'contain',aspectRatio: 1.0,}}
            />
          </View>
          <View style={{marginTop:13}}>
          <Text style={{ fontSize: 17, marginTop: 10, fontFamily: "Jalnan",}}>
            {plant.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text style={{fontSize: 19, fontFamily: "Jalnan",}}>
            ₩{plant.price}
            </Text>
            
          </View>
          </View>
          
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.white}}>
      <View style={style.header}>
        <View style={{flexDirection:'row',width:'100%'}}>        
          <Text style={{fontSize: 21, fontFamily: "Jalnan",}}>미니룸 스토어</Text>

        </View>
      </View>
      <View style={{alignSelf:'flex-end'}}>
      <Text style={{fontSize: 18, fontFamily: "Jalnan",}}> <Icons
                name="coins"
                size={18}/>  {userData ? userData.point : ''}</Text>
      </View>

     
      <View style={{marginTop: 30, flexDirection: 'row'}}>
        <View style={style.searchContainer}>
          <Icon name="search" size={25} style={{marginLeft: 20}} />
          <TextInput placeholder="아이템찾기" style={style.input} />
        </View>
        <View style={style.sortBtn}>
          <Icon name="sort" size={20} color={COLORS.white} />
        </View>
      </View>
      
      <CategoryList />
      <FlatList
        columnWrapperStyle={{justifyContent: 'space-between'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        numColumns={2}
        data={
          (function() {
            if (catergoryIndex === 0) return tool;
            if (catergoryIndex === 1) return minime;
            if (catergoryIndex === 2) return Background;
            if (catergoryIndex === 3) return Minipat;
          })()
        }
        renderItem={({item}) => {
          return <Card plant={item} />;
        }}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categoryText: {fontSize: 16, color: 'grey', fontFamily: "Jalnan", },
  categoryTextSelected: {
    color: COLORS.orange,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: COLORS.orange,
  },
  card: {
    height: 225,
    backgroundColor: COLORS.light,
    width,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  header: {
    marginTop: 20,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    height: 45,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: "Jalnan",
    color: COLORS.dark,
  },
  sortBtn: {
    marginLeft: 10,
    height: 40,
    width: 0,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default StoreHome;