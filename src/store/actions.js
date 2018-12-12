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
  loadTests({ commit, state }) {
    const db = firebase.firestore(),
      user = state.user;

    let tests = [],
      docs = [],
      testRef = db.collection('tests').where('deleted', '==', false),
      resultsCollection = db.collection('results');

    if (user.role !== 'admin') {
      testRef = testRef.where('active', '==', true);
    }

    testRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          tests.push({ id: doc.id, grade: 0, progress: 0, ...doc.data() });

          if (user.role !== 'admin') {
            docs.push(resultsCollection.doc(`${user.id}_${doc.id}`).get());
          }
        });

        if (docs.length === 0) {
          commit('setTests', tests);
          return;
        } else {
          return Promise.all(docs);
        }
      })
      .then((querySnapshot) => {
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            tests = tests.map((test) => {
              let progress = -1;

              if (test.id === doc.data().testId) {
                progress = doc.data().progress;
              }

              return {
                ...test,
                progress
              };
            });

            commit('setTests', tests);
          });
        }
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
  setResultToTest({ commit }, resultTest) {
    const db = firebase.firestore(),
      resultsCollection = db.collection('results'),
      userId = resultTest.userId,
      testId = resultTest.testId,
      docRef = resultsCollection.doc(`${userId}_${testId}`);

    return docRef
      .set(resultTest)
      .then(() => {
        commit('setResultToTest', resultTest);
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
  getResultToTest({ commit }, { userId, testId, correctAnswers }) {
    const db = firebase.firestore(),
      resultsCollection = db.collection('results');

    let docRef = resultsCollection.doc(`${userId}_${testId}`);

    return docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          commit('setResultToTest', doc.data());
        } else {
          const answers = new Array(correctAnswers.length).fill(-1),
            initialAnswers = new Array(correctAnswers.length).fill(-1),
            grade = -1,
            resultTest = {
              testId,
              userId,
              initialAnswers,
              answers,
              grade,
              progress: 0,
              correctAnswers
            };

          docRef
            .set(resultTest)
            .then(() => {
              commit('setResultToTest', resultTest);
            })
            .catch((error) => {
              commit('setAlert', {
                show: true,
                color: '#FF0000',
                message: `Eroare! ${error}`
              });
            });
        }
      })
      .catch((error) => {
        commit('setAlert', {
          show: true,
          color: '#FF0000',
          message: `Eroare! ${error}`
        });
      });
  },
  getUsersTestResults({ commit }, testId) {
    const db = firebase.firestore(),
      userCollection = db.collection('users');

    let docs = [],
      tests = [];

    db.collection('results')
      .where('testId', '==', testId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { userId, testId, progress, grade } = doc.data();

          tests.push({ userId, testId, progress, grade });

          docs.push(userCollection.doc(`${userId}`).get());
        });

        if (docs.length > 0) {
          return Promise.all(docs);
        } else {
          commit('setUsersTestResults', []);
        }
      })
      .then((querySnapshot) => {
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            tests = tests.map((test) => {
              if (test.userId === doc.id) {
                const { name } = doc.data();
                return {
                  name,
                  ...test
                };
              } else {
                return test;
              }
            });

            commit('setUsersTestResults', tests);
          });
        }
      })
      .catch((error) => {
        commit('setAlert', {
          show: true,
          color: '#FF0000',
          message: `Eroare! ${error}`
        });
      });
  },
  updateAlert({ commit }, alert) {
    commit('setAlert', alert);
  }
};
