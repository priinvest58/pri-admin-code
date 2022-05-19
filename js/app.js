var priApp = angular.module('priApp', ['angularMoment']);

priApp.run([
    '$rootScope',
    '$window',
    function($rootScope, $window) {
        var firebaseConfig = {
            apiKey: "AIzaSyBjUBzfGYKVhbNpPbWrLR41RD_7GNSzkjU",
            authDomain: "priproject-7193b.firebaseapp.com",
            projectId: "priproject-7193b",
            storageBucket: "priproject-7193b.appspot.com",
            messagingSenderId: "401631519655",
            appId: "1:401631519655:web:21724a05f1c9beca388c82",
            measurementId: "G-LW6RVB7QE5"
        };
        // Initialize Firebase
        try {
            $window.firebase.initializeApp(firebaseConfig);
            $window.firebase.analytics();
            $rootScope.db = firebase.firestore();
            $rootScope.storage = firebase.storage();
        } catch (error) {}
    },
]);

priApp.controller('MainController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {
    $scope.user = {};
    $scope.invalidSponsor = false;
    $scope.validEmail = false;
    $scope.validUsername = false;
    $scope.sponsorList = [];
    $scope.user.country = $window.localStorage.getItem("country");

    $scope.applyChange = function() {
        search_sponsor();
    }

    $scope.submitForm = function() {
        var guid = createGuid();

        $rootScope.db
            .collection('investors')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                firstname: `${$scope.user.firstname}`,
                lastname: `${$scope.user.lastname}`,
                dob: `${$scope.user.dob}`,
                gender: `${$scope.user.gender}`,
                documentID: `${$scope.user.documentID}`,
                email: `${$scope.user.email}`,
                phone: `${$scope.user.phone}`,
                zipCode: `${$scope.user.zipCode}`,
                address: `${$scope.user.address}`,
                state: `${$scope.user.state}`,
                address2: `${$scope.user.address2}`,
                city: `${$scope.user.city}`,
                country: `${$scope.user.country}`,
                username: `${$scope.user.username}`,
                password: `${$scope.user.password}`,
                sponsor: `${$scope.user.sponsor}`,
            })
            .then(() => {
                $scope.user = {};
                alert(`User was created successfully!`);
                $window.location.href = "./index.html";

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });
    }

    $scope.validateEmail = function() {
        try {

            if (validateEmail($scope.user.email)) {
                $rootScope.db.collection('investors').where("email", "==", $scope.user.email).get().then(result => {
                    const data = result.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    console.log(data);

                    $scope.$apply(function() {
                        if (data.length == 0) {
                            $scope.validEmail = true;
                        } else {
                            $scope.validEmail = false;
                        }

                    });
                });

            } else {
                $scope.validEmail = false;

            }

        } catch (error) {

        }

    }

    $scope.validateUsername = function() {

        try {
            $rootScope.db.collection('investors').where("username", "==", $scope.user.username).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log(data);

                $scope.$apply(function() {
                    if (data.length == 0) {
                        $scope.validUsername = true;
                    } else {
                        $scope.validUsername = false;
                    }

                });
            });
        } catch (error) {

        }

    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    function search_sponsor() {

        try {
            $rootScope.db.collection('investors').where("username", "==", $scope.user.sponsor).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));


                $scope.$apply(function() {
                    $scope.sponsorList = data;
                    if (data.length == 0) {
                        $scope.invalidSponsor = true;
                    } else {
                        $window.localStorage.setItem("sponsor", JSON.stringify(data[0]));
                        $scope.user.sponsor = data[0].username;
                        // $('#modal1').modal('hide');
                        $('.close').click();
                        $scope.invalidSponsor = false;
                        console.log($scope.user);
                    }

                });
            });
        } catch (error) {

        }
    }

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});

priApp.controller('LoginController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {

    $scope.user = {};

    $scope.onLogin = function() {
        console.log($scope.user);

        $window.firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function() {
            $window.localStorage.setItem("user", "1");
            $window.location.href = "./dashboard.html";

            console.log("LogIn");
        }, function(error) {
            console.log(error.code);
            console.log(error.message);
            alert(error.message);
        });
    }



    function loadCategoriesFromServer() {
        try {
            $rootScope.db.collection('categories').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                $scope.$apply(function() {
                    $scope.categories = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }
    };

    $scope.checkCatItems = function(cat) {

        $window.localStorage.setItem("currentCat", JSON.stringify(cat));
        console.log(cat);
        $window.location.href = "./main_cat.html";

    }


    $scope.submitForm = function() {

        var guid = createGuid();

        $rootScope.db
            .collection('categories')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                name: `${$scope.form.name}`,
            })
            .then(() => {
                $scope.form.name = "";
                loadNumbersFromServer();
                alert(`Created!`);

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });


    };



    function loadProducts() {
        try {
            $rootScope.db.collection('products').where("categoryID", "==", $scope.cat.id).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                $scope.$apply(function() {
                    $scope.products = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }
    };

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});


priApp.controller('DashboardController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {


    $scope.stat = {
        totalUser: 0,

    };

    loadUsers();

    function loadUsers() {
        try {
            $rootScope.db.collection('investors').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.stat.totalUser = data.length;

                });
            });
        } catch (error) {

        }
    };


    $scope.submitForm = function() {

        var guid = createGuid();

        $rootScope.db
            .collection('products')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                name: `${$scope.form.name}`,
                category: `${$scope.form.category.split("@@@")[0]}`,
                categoryID: `${$scope.form.category.split("@@@")[1]}`,
                price: `${$scope.form.price}`,
                url: '',
            })
            .then(() => {
                $scope.form = {};
                loadProductsFromServer();
                alert(`Created!`);

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });


    };

    $scope.uploadPhoto = function(product) {
        console.log(product);
        $("#modal3").modal({
            escapeClose: false,
            clickClose: false,
            showClose: false,
            fadeDuration: 250,
            fadeDelay: 0.80
        });
        $scope.form2 = product;



    }

    $scope.processPhoto = function() {

        if ($window.clientPhotos.length != 0) {
            console.log($window.clientPhotos);
            var file = $window.clientPhotos[0];
            var filename = createGuid();
            var storage = $rootScope.storage.ref(filename);
            var upload = storage.put(file);

            upload.on(
                "state_changed",
                function progress(snapshot) {
                    var percentage =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("progress").value = percentage;
                },

                function error() {
                    alert("error uploading file");
                },

                function complete() {
                    document.getElementById(
                        "uploading"
                    ).innerHTML += `${file.name} upoaded <br />`;

                    storage
                        .getDownloadURL()
                        .then(function(url) {
                            $scope.form2.url = url;

                            updateProduct($scope.form2);
                        })
                        .catch(function(error) {
                            console.log("error encountered");
                        });

                }
            );


        } else {
            alert("No file chosen");
        }




    }

    function updateProduct(p) {


        $rootScope.db
            .collection('products')
            .doc(`${p.id}`)
            .set({
                id: `${ p.id}`,
                name: `${p.name}`,
                category: `${p.category}`,
                categoryID: `${p.categoryID}`,
                price: `${p.price}`,
                url: `${p.url}`,
            })
            .then(() => {
                loadProductsFromServer();


            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });


    };


    $scope.editProduct = function(p) {

        $scope.form2 = p;



        $("#modal2").modal({
            escapeClose: false,
            clickClose: false,
            showClose: false,
            fadeDuration: 250,
            fadeDelay: 0.80
        });


    }

    $scope.updateForm = function() {

        var catText = $("#category2 option:selected").text();

        $scope.form2.category = catText;
        $rootScope.db
            .collection('products')
            .doc(`${$scope.form2.id}`)
            .set({
                id: `${ $scope.form2.id}`,
                name: `${$scope.form2.name}`,
                category: `${$scope.form2.category}`,
                categoryID: `${$scope.form2.categoryID}`,
                price: `${$scope.form2.price}`,
                url: `${$scope.form2.url}`,
            })
            .then(() => {
                $scope.form = {};
                loadProductsFromServer();
                alert(`Edited!`);

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });



    }

    $scope.deleteProduct = function(p) {
        if (confirm("Are you sure, you want to delete the record?")) {
            $rootScope.db
                .collection('products')
                .doc(`${p.id}`)
                .delete()
                .then(() => {
                    loadProductsFromServer();


                })
                .catch(error => {
                    alert('Error deleting document: ', error);
                });

        }

    }


    function loadProductsFromServer() {
        try {
            $rootScope.db.collection('products').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.data = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }
    };

    function loadCategoriesFromServer() {
        try {
            $rootScope.db.collection('categories').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.categories = data;

                });
                console.log('All numbers in collections', data);
            });
        } catch (error) {

        }

    };

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});

priApp.controller('InvestorController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {


    console.log(moment());
    $scope.users = [];
    $scope.account = {};

    loadUsers();

    function loadUsers() {
        try {
            $rootScope.db.collection('investors').get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.users = data;

                });
            });
        } catch (error) {

        }
    };

    $scope.viewAccount = function(user) {
        $window.localStorage.setItem("c_user", JSON.stringify(user));
        $window.location.href = "./investor_details.html";
    }


    $scope.activateAccount = function() {

        $scope.account.user = JSON.parse($window.localStorage.getItem("currentUser"));

        console.log($scope.account);
        var guid = createGuid();

        $rootScope.db
            .collection('accounts')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                investorID: `${$scope.account.user.id}`,
                totalBalance: `${$scope.account.totalBalance}`,
                topupBalance: `${$scope.account.topupBalance}`,
                totalBonus: `${$scope.account.totalBonus}`,
                packageName: `${$scope.account.packageName}`,
                rank: `${$scope.account.rank}`,
                regDate: {
                    year: moment().year(),
                    month: moment().month(),
                    day: moment().date(),
                }
            })
            .then(() => {
                $scope.form = {};
                loadUsers();
                $('.close').click();
                alert(`Package was  successfully added!`);

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });

    }

    $scope.openActivateWindow = function(user) {
        $window.localStorage.setItem("currentUser", JSON.stringify(user));
        $("#modal1").modal({
            escapeClose: true,
            clickClose: true,
            showClose: true,
            fadeDuration: 250,
            fadeDelay: 0.80
        });
    }


    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }




});

priApp.controller('InvestmentDetailsController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {


    $scope.user = {};
    $scope.accounts = [];
    $scope.account = {};


    loadUsers();


    $scope.viewAccount = function(user) {
        $window.localStorage.setItem("c_user", JSON.stringify(user));
        $window.location.href = "./investor_details.html";
    }

    $scope.openActivateWindow = function() {

        $("#modal1").modal({
            escapeClose: true,
            clickClose: true,
            showClose: true,
            fadeDuration: 250,
            fadeDelay: 0.80
        });

    }

    $scope.addPackage = function() {

        $scope.user = JSON.parse($window.localStorage.getItem("c_user"));

        console.log($scope.account);
        var guid = createGuid();

        $rootScope.db
            .collection('accounts')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                investorID: `${$scope.user.id}`,
                totalBalance: `${$scope.account.totalBalance}`,
                topupBalance: `${$scope.account.topupBalance}`,
                totalBonus: `${$scope.account.totalBonus}`,
                packageName: `${$scope.account.packageName}`,
                rank: `${$scope.account.rank}`,
                regDate: {
                    year: moment().year(),
                    month: moment().month(),
                    day: moment().date(),
                }
            })
            .then(() => {
                $scope.form = {};
                loadUsers();
                $('.close').click();
                alert(`Package was  successfully added!`);

            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });

    }

    function loadUsers() {
        try {
            $scope.user = JSON.parse($window.localStorage.getItem("c_user"));
            console.log($scope.user);
            $rootScope.db.collection('accounts').where("investorID", "==", $scope.user.id).get().then(result => {
                const data = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                $scope.$apply(function() {
                    $scope.accounts = data;
                    console.log($scope.user, $scope.accounts);


                });
            });

        } catch (error) {

        }
    };

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }




});