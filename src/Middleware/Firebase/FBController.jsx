import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { Store } from "../Store";
import { setUserState, setInitialState } from "./UserController";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Banner from '../../assets/Image/BackGround/Banner.jpg'

function randomString(length) {
  var chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  var str = "";
  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

export const fetchUser = async (userid) => {
  try {
    const userDocRef = doc(db, "User", userid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log("User Data : ", userData);
      localStorage.setItem("User", userid);
      Store.dispatch(setUserState(userData));
      return userData;
    } else {
      console.error("User document not found");
      return null;
    }
  } catch (error) {
    console.error("fetchUser Error:", error);
    console.log("Data:", error.message);
    return null;
  }
};

export const FB_Logout = async () => {
  try {
    SetStatus(false)
    Store.dispatch(setInitialState());
    localStorage.removeItem("User");
  } catch (error) {
    console.log("FBLogin Error:", error);
  }
};

export const FB_Login = async (uid) => {
  try {
    const userDocRef = doc(db, "User", uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } else {
      console.error('User document does not exist');
      return null;
    }
  } catch (error) {
    console.error('fetchUser Error:', error);
    console.log('Data:', error.message);
    return null;
  }
};

export const FB_SignUp = async (uid, userData) => {
  try {
    const userDocRef = doc(db, "User", uid);
    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
      quizCompleted: false,
      TotalMatch: 0,
      WinMatch: 0,
      Status: true
    });
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
};

export const SetStatus = async (value) => {
  if (localStorage.getItem("User") != null) {
    const NewUserRef = doc(db, "User", localStorage.getItem("User"));
    updateDoc(NewUserRef, { Status: value });
    if (value) {
      fetchUser(localStorage.getItem("User"));
    }
  }
}

export const FB_SetCommputerGame = async (payload) => {
  try {
    console.log("Game Data:", payload["pgn"]);
    if (Store.getState().USER_STATE.value.islogin) {
      let GameId = randomString(8)
      const GameRef = doc(db, "User", Store.getState().USER_STATE.value.USER, "ComputerGame", GameId);
      setDoc(GameRef, {
        Game_Id: GameId,
        PGN: payload["pgn"],
        Final_Fen: payload["Final_Fen"],
        ChartNameData: payload["ChartNameData"],
        ChartData: payload["ChartData"],
        GameStatus: payload["GameStatus"],
        Move: payload["Move"],
      });
    } else {
      console.log("User Not login Game Not Save");
    }
  } catch (error) {
    console.log("FB_SetCommputerGame Error:", error);
  }
};

export const FB_SetPvPGame = async (payload) => {
  try {
    if (Store.getState().USER_STATE.value.islogin) {
      let GameId = randomString(8)
      const GameRef = doc(db, "User", Store.getState().USER_STATE.value.USER, "PvPGame", GameId);
      setDoc(GameRef, {
        Game_Id: GameId,
        PGN: payload["pgn"],
        Final_Fen: payload["Final_Fen"],
        ChartNameData: payload["ChartNameData"],
        ChartData: payload["ChartData"],
        GameStatus: payload["GameStatus"],
        Move: payload["Move"],
      });
    } else {
      console.log("User Not login Game Not Save");
    }
  } catch (error) {
    console.log("FB_SetPvPGame Error:", error);
  }
};

export const SetGameCount = async (value) => {
  if (localStorage.getItem("User") != null) {
    const NewUserRef = doc(db, "User", localStorage.getItem("User"));
    updateDoc(NewUserRef, { TotalMatch: Store.getState().USER_STATE.value.TotalMatch + 1, WinMatch: Store.getState().USER_STATE.value.WinMatch + value });
    fetchUser(localStorage.getItem("User"));
  }
}

// export const UploadFile = async (Name, File) =>{
//     if (localStorage.getItem("User") == null) {//         const storageRef = ref(storage,'Image/'+Name);
//         uploadBytes(storageRef, File).then((snapshot) => {
//           getDownloadURL(storageRef).then((URL)=>{
//             console.log('Uploaded file URL: ',URL);
//             return URL;
//           })

//         });
//     }
// }