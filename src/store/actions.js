import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  setUser(context, user) {
    context.commit('setUser', user);
  },
  signup({ commit }, user) {
    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(
      (firebaseUser) => {
        const db = firebase.firestore();

        return db.collection('users').doc(firebaseUser.user.uid).set({
          email: user.email,
          name: user.name,
          role: user.role
        });
      },
      (err) => {
        console.log(err);
      }
    ).then((doc) => {
      console.log(doc);
      commit('setUser', user);
    });
  },
  login({ commit }, user) {
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(
      (firebaseUser) => {
        const db = firebase.firestore();

        return db.collection('users').doc(firebaseUser.user.uid).get();
      },
      (err) => {
        console.log(err);
      }
    ).then((doc) => {
      commit('setUser', doc.data());
    });
  },
  loadTests({ commit }) {
    // eslint-disable-next-line
    let tests = [];
    const db = firebase.firestore();

    db.collection('tests').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tests.push({ id: doc.id, ...doc.data() });
      });

      commit('setTests', tests);
    });
  },
  deleteTest({ commit }, test) {
    const db = firebase.firestore();

    db.collection('tests').doc(test.id).set({
      ...test,
      deleted: true
    }).then(() => {
      commit('setAlert', {
        show: true,
        color: '#00FF00',
        message: 'Testul a fost sters!'
      });
    // eslint-disable-next-line
    }).catch((error) => {
      commit('setAlert', {
        show: true,
        color: '#FF0000',
        message: `Eroare! Testul nu a fost sters! ${error}`
      });
    });
  },
  updateAlert({ commit }, alert) {
    commit('setAlert', alert);
  }
};

