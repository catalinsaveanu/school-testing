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
        commit('setUser', {
          id: doc.id,
          ...user
        });
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
        commit('setUser', {
          id: doc.id,
          ...doc.data()
        });
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
      })
      .catch((error) => {
        commit('setAlert', {
          show: true,
          color: '#FF0000',
          message: `Eroare! Testul nu a fost salvat! ${error}`
        });
      });
  },
  setProblemAnswer({ commit }, { userId, testId, answerObj, correctAnswers }) {
    const db = firebase.firestore(),
      resultsCollection = db.collection('results');

    let docRef = resultsCollection.doc(`${userId}_${testId}`);

    return docRef
      .get()
      .then((doc) => {
        let answers = new Array(correctAnswers.length).fill(-1);

        if (doc.exists) {
          answers = doc.data().answers;
        }

        answers[answerObj.problemIndex] = answerObj.value;

        const completeAnswers = answers.filter((answer) => answer === -1)
            .length,
          test = {
            testId,
            userId,
            answers,
            progress: Math.floor((1 - completeAnswers / answers.length) * 100),
            correctAnswers
          };

        return docRef.set(test);
      })
      .catch((error) => {
        commit('setAlert', {
          show: true,
          color: '#FF0000',
          message: `Eroare! Rezultatul nu a fost salvat! ${error}`
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
