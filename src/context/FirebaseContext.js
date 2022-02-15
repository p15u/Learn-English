import React, { createContext } from "react";

import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import config from "../config/firebase";

const FirebaseContext = createContext();

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();

const Firebase = {
  getCurrentDate: () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    return (today = mm + "/" + dd + "/" + yyyy);
  },

  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },

  createUser: async (user) => {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password);
      const uid = Firebase.getCurrentUser().uid;

      let profilePhotoURL = "default";

      await db.collection("users").doc(uid).set({
        username: user.username,
        email: user.email,
        profilePhotoURL,
        method: 0,
        createAt: Firebase.getCurrentDate(),
        notiToken: "",
        notifications: [],
        public: 0,
      });

      if (user.profilePhoto) {
        profilePhotoURL = await Firebase.uploadProfilePhoto(user.profilePhoto);
      }

      delete user.password;
      return { ...user, profilePhotoURL, uid };
    } catch (error) {
      console.log("Error @createUser: ", error.message);
      return false;
    }
  },

  createUserWithGoogleAccount: async (user) => {
    try {
      const uid = Firebase.getCurrentUser().uid;

      await db.collection("users").doc(uid).set({
        username: user.username,
        email: user.email,
        profilePhotoURL: user.profilePhotoURL,
        method: 1,
        createAt: Firebase.getCurrentDate(),
        notiToken: "",
        notifications: [],
        public: 0,
      });
    } catch (error) {
      console.log("Error @createUserWithGoogleAccount: ", error.message);
    }
  },

  createUserWithFacebookAccount: async (user) => {
    try {
      const uid = Firebase.getCurrentUser().uid;

      await db.collection("users").doc(uid).set({
        username: user.username,
        fbid: user.fbid,
        profilePhotoURL: user.profilePhotoURL,
        method: 2,
        createAt: Firebase.getCurrentDate(),
        notiToken: "",
        notifications: [],
        public: 0,
      });
    } catch (error) {
      console.log("Error @createUserWithFacebookAccount: ", error.message);
    }
  },

  updateUser: async (newUser) => {
    try {
      const uid = Firebase.getCurrentUser().uid;

      await db
        .collection("users")
        .doc(uid)
        .update(newUser)
        .then(() => console.log("Update successful"))
        .catch(() => console.log("An error occurred"));
    } catch (error) {
      console.log("Error @updateUser: ", error.message);
    }
  },

  uploadProfilePhoto: async (uri) => {
    const uid = Firebase.getCurrentUser().uid;
    try {
      const photo = await Firebase.getBlob(uri);

      const imageRef = firebase.storage().ref("profilePhotos").child(uid);
      await imageRef.put(photo);

      const url = await imageRef.getDownloadURL();

      await db.collection("users").doc(uid).update({
        profilePhotoURL: url,
      });

      return url;
    } catch (error) {
      console.log("Error @UploadPhoto: ", error.message);
    }
  },

  uploadVocabPhoto: async (uri, vocabSetId, vocabId) => {
    const uid = Firebase.getCurrentUser().uid;
    try {
      if (uri !== "") {
        const photo = await Firebase.getBlob(uri);

        const imageRef = firebase
          .storage()
          .ref("vocabPhotos")
          .child(uid + "/" + vocabSetId + "/" + vocabId);

        await imageRef.put(photo);

        const url = await imageRef.getDownloadURL();

        return url;
      } else {
        return "";
      }
    } catch (error) {
      console.log("Error @UploadVocabPhoto: ", error.message);
    }
  },

  getBlob: async (uri) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        resolve(xhr.response);
      };

      xhr.onerror = () => {
        reject(new TypeError("Error request failed."));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  },

  getUserInfo: async (uid) => {
    try {
      const user = await db.collection("users").doc(uid).get();

      if (user.exists) {
        return user.data();
      }
    } catch (error) {
      console.log("Error @GetUserInfo: ", error.message);
    }
  },

  isExistsEmail: async (email) => {
    try {
      const isExists = await db
        .collection("users")
        .where("email", "==", email)
        .get();
      console.log("is", isExists);
      if (isExists) {
        return true;
      }

      return false;
    } catch (error) {
      console.log("Error @IsExistsEmail: ", error.message);
    }
  },

  changePassword: async (newPassword) => {
    try {
      const currentUser = Firebase.getCurrentUser();

      const user = await Firebase.getUserInfo(currentUser.uid);

      if (user) {
        await currentUser.updatePassword(newPassword);

        return true;
      }

      return false;
    } catch (error) {
      console.log("Error @ChangePassword: ", error.message);
    }
  },

  resetPassword: async (email) => {
    try {
      await firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => console.log("OK"))
        .catch(() => {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorMessage);
        });
      return true;
    } catch (error) {
      console.log("Error @resetPassword: ", error.message);
      return false;
    }
  },

  signOut: async () => {
    try {
      await firebase.auth().signOut();

      return true;
    } catch (error) {
      console.log("Error @logOut: ", error.message);
    }

    return false;
  },

  signIn: async (email, password) => {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  },

  // Handle Vocabulary
};

const FirebaseProvider = (props) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
