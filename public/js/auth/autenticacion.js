class Autenticacion {
  autEmailPass (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result =>{
      if(result.user.emailVerified){
        Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000);
        $('#avatar').attr('src', 'imagenes/usuario_auth.png');
      }else {
        firebase.auth().signOut();
        Materialize.toast(`Por favor realiza la verificacion de la cuenta`, 5000);
      }
    })
    
    .catch(err =>{
      Materialize.toast(`${err}`, 4000);
    });

    $('.modal').modal('close')
   
  }

  crearCuentaEmailPass (email, password, nombres) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(result =>{
      //solo podemos almacenar email, password y nombre.
      result.user.updateProfile({
        displayName: nombres
      })

      const configuration ={
        url: 'http://localhost:3000/'
      }

      result.user.sendEmailVerification(configuration).catch(err =>{
        console.log(err);
        Materialize.toast(err.message, 4000);
      });

      firebase.auth().signOut()

      Materialize.toast(
        `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
        4000)

      $('.modal').modal('close')

    })
    .catch(err =>{
      console.log(err);
      Materialize.toast(err.message, 4000);
    })

    
    
  }

  authCuentaGoogle () {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result =>{
      $('#avatar').attr('src', result.user.photoURL);
      $('.modal').modal('close');
      Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000);
    }).catch(err =>{
      console.log(`${err}`);
      Materialize.toast(`Error: ${err} !! `, 4000);
    })
  }

  authCuentaFacebook () {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result =>{
      $('#avatar').attr('src', result.user.photoURL);
      $('.modal').modal('close');
      Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000);
    }).catch(err =>{
      console.log(`${err}`);
      Materialize.toast(`Error con facebook: ${err} !! `, 4000);
    })
  }

  //Github
  authGithub () {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result =>{
      $('#avatar').attr('src', result.user.photoURL);
      $('.modal').modal('close');
      Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000);
    }).catch(err =>{
      console.log(`${err}`);
      Materialize.toast(`Error con github: ${err} !! `, 4000);
    })
  }

  MissingPass(){
    
  }
}
