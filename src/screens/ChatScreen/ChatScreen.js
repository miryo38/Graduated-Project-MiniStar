import React,{useState,useEffect,useContext} from 'react'
import { View } from 'react-native'
import { GiftedChat,Bubble,InputToolbar,} from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../utils/AuthProvider'
import ChatHeader from '../../Chat/Components/messages/ChatHeader'

export default function ChatScreen({route}) {
  const [messages, setMessages] = useState([]);
  const {uid} = route.params;

  const {user, logout} = useContext(AuthContext);
  const getAllMessages = async ()=>{
     const docid  = uid > user.uid ? user.uid+ "-" + uid : uid+"-"+user.uid 
     const querySanp = await firestore().collection('chatrooms')
     .doc(docid)
     .collection('messages')
     .orderBy('createdAt',"desc")
     .get()
    const allmsg =   querySanp.docs.map(docSanp=>{
         return {
             ...docSanp.data(),
             createdAt:docSanp.data().createdAt.toDate()
         }
     })
     setMessages(allmsg)

 
  }
 useEffect(() => {
    getAllMessages()

   const docid  = uid > user.uid ? user.uid+ "-" + uid : uid+"-"+user.uid 
     const messageRef = firestore().collection('chatrooms')
     .doc(docid)
     .collection('messages')
     .orderBy('createdAt',"desc")

   const unSubscribe =  messageRef.onSnapshot((querySnap)=>{
         const allmsg =   querySnap.docs.map(docSanp=>{
          const data = docSanp.data()
          if(data.createdAt){
              return {
                 ...docSanp.data(),
                 createdAt:docSanp.data().createdAt.toDate()
             }
          }else {
             return {
                 ...docSanp.data(),
                 createdAt:new Date()
             }
          }
             
         })
         setMessages(allmsg)
     })


     return ()=>{
       unSubscribe()
     }

     
   }, [])

   const onSend =(messageArray) => {
     const msg = messageArray[0]
     const mymsg = {
         ...msg,
         sentBy:user.uid,
         sentTo:uid,
         createdAt:new Date()
     }
    setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))
    const docid  = uid > user.uid ? user.uid+ "-" + uid : uid+"-"+ user.uid 

    firestore().collection('chatrooms')
    .doc(docid)
    .collection('messages')
    .add({...mymsg,createdAt:firestore.FieldValue.serverTimestamp()})


   }

   
 return (
   
     <View style={{flex:1,backgroundColor:"#f5f5f5"}}>
       <ChatHeader
       onPress={() => {}}
				username={route.params.name}
        picture={route.params.img}
				
				onlineStatus= {route.params ? route.params.about || '자유로운 소통공간 미니스타!' : ''}/>
        <GiftedChat
             messages={messages}
             onSend={text => onSend(text)}
             user={{
                 _id: user.uid,
             }}
             renderBubble={(props)=>{
                 return <Bubble
                 {...props}
                 wrapperStyle={{
                   right: {
                     backgroundColor:"orange",
                     

                   }
                   
                 }}
               />
             }}

             renderInputToolbar={(props)=>{
                 return <InputToolbar {...props}
                  containerStyle={{borderTopWidth: 1.5, borderTopColor: '#8a2be2'}} 
                  textInputStyle={{ color: "black" }}
                  />
             }}
             
             />
            
     </View>
 )
}

