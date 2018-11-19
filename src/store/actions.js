import firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  setUser(context, user) {
    context.commit('setUser', user);
  },
  signup({ commit }, user) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((firebaseUser) => {
        const db = firebase.firestore();

        return db
          .collection('users')
          .doc(firebaseUser.user.uid)
          .set({
            email: user.email,
            name: user.name,
            role: user.role
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .then((doc) => {
        console.log(doc);
        commit('setUser', user);
      });
  },
  login({ commit }, user) {
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase
          .auth()
          .signInWithEmailAndPassword(user.email, user.password);
      })
      .then((firebaseUser) => {
        const db = firebase.firestore();

        return db
          .collection('users')
          .doc(firebaseUser.user.uid)
          .get();
      })
      .catch((err) => {
        console.log(err);
      })
      .then((doc) => {
        commit('setUser', doc.data());
      });
  },
  loadTests({ commit }) {
    // eslint-disable-next-line
    let tests = [];
    const db = firebase.firestore();

    db.collection('tests')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tests.push({ id: doc.id, ...doc.data() });
        });

        commit('setTests', tests);
      });
  },
  saveTest({ commit }, test) {
    const db = firebase.firestore(),
      testCollection = db.collection('tests');

    let actionRef;

    if (test.id) {
      actionRef = testCollection.doc(test.id).update(test);
    } else {
      actionRef = testCollection.add(test);
    }

    return actionRef
      .then(() => {
        commit('setAlert', {
          show: true,
          color: '#00FF00',
          message: 'Testul a fost salvat!'
        });
        // eslint-disable-next-line
      })
      .catch((error) => {
        commit('setAlert', {
          show: true,
          color: '#FF0000',
          message: `Eroare! Testul nu a fost salvat! ${error}`
        });
      });
  },
  deleteTest({ commit }, test) {
    const db = firebase.firestore();

    db.collection('tests')
      .doc(test.id)
      .set({
        ...test,
        deleted: true
      })
      .then(() => {
        commit('deleteTest', test);

        commit('setAlert', {
          show: true,
          color: '#00FF00',
          message: 'Testul a fost sters!'
        });
        // eslint-disable-next-line
      })
      .catch((error) => {
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
