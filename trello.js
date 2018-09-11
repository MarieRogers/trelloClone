  // Initialize Firebase
var config = {
    apiKey: "AIzaSyDBZEwjpcPlosGTVgPMJef306DxiI_ULjI",
    authDomain: "vue-trello-board.firebaseapp.com",
    databaseURL: "https://vue-trello-board.firebaseio.com",
    projectId: "vue-trello-board",
    storageBucket: "vue-trello-board.appspot.com",
    messagingSenderId: "288842131717"
};
// global access to initialized app database
var db = firebase.initializeApp(config).database();
// global reference to remote data
var itemsRef = db.ref('cards');
var userRef = db.ref('users');
var imgRef = db.ref('images');
var twoitemsRef = db.ref('cards2');
var storageRef = firebase.storage().ref();
var activitiesRef = db.ref('actions');
var catsRef = db.ref('categories');
var randomRef = db.ref('random');
// connect Firebase to Vue
Vue.use(VueFire);


var todoApp = new Vue({
    data: {
        startscreen: true,
        newImgTitle: '',
        newCard: '',
        newTodo: '',
        newInLi: '',
        newInCaLi: '',
        newInTodo: '',
        newDescrip: '',
        newTodoCat: '',
        cards: [],
        newColor: 'white',
        newCardCol: '#F5F5F5',
        newDue: '',
        newD: '',
        vertical: false,
        dis: 'flex',
        editActive: false,
        bgcol: '#f7cac9',
        bgimg: '',
        sbcol: '#f7786b',
        Name: '',
        Name2: '',
        Email: '',
        Email2: '',
        Image: '',
        Usr: '',
        userE: false,
        inUsr: '',
        hide: false,
        newCat: '',
        filDate: '',
        bgOptions: [
            { text: 'Color', value1: 'lightgrey', value2: 'white' },
            { text: 'Pinks', value1: '#f7786b', value2: '#f7cac9' },
            { text: 'Blues', value1: '#034f84', value2: '#92a8d1' },
            { text: 'Yellows', value1: '#ffcc5c', value2: '#ffeead' },
            { text: 'Purples', value1: '#622569', value2: '#b8a9c9' }
        ],
        //Images attributed to Flickr and are "All creative commons" licensed
        bgImages: [
            { text: 'Image', value: '' },
            { text: 'City', value: 'images/city.jpg' },
            { text: 'Dogs', value: 'images/dogs.jpg' },
            { text: 'Elephants', value: 'images/elephants.jpg' },
            { text: 'Ocean', value: 'images/ocean.jpg' },
            { text: 'Sky', value: 'images/sky.jpg' },
            { text: 'Lights', value: 'images/lights.jpg' }
        ]
    },
    firebase: {
        cards: itemsRef,
        users: userRef,
        images: imgRef,
        cards2: twoitemsRef,
        actions: activitiesRef,
        categories: catsRef,
        random: randomRef
    },  
    methods: {
        //updates sbcol, bgcol, and bgimg
        otherPush: function() {
            randomRef.update({
                sbcol: this.sbcol,
                bgcol: this.bgcol,
                bgimg: this.bgimg
            });
        },
        clearBg: function() {
            randomRef.update({
                bgimg: ''
            });
            this.bgimg = '';
        },
        //edits bgimg to fit the correct url input specification
        urlImg: function(bgimg) {
            bgimg = "url('"+bgimg+"')";
            return bgimg;
        },
        //specific images for the selected card
        cardImgs: function(images, card, index, todo) {
            var filteredimgs = [];
            for(var x = 0; x < images.length; x++) {
                if(images[x].cardname == card.name && images[x].listelement.item == todo.item && images[x].lindex == index) {
                    filteredimgs.push(images[x]);
                }
            }
            return filteredimgs;
        },
        //array of possible unique categories of lists
        cardCats: function(cards) {
            var cats = [];
            const set = new Set([]);
            for(const card of cards) {
                if(!set.has(card.category)) {
                    cats.push({
                        title: card.category
                    });
                }
            set.add(card.category);
            }
            return cats;
        },
        //add a list
        addCard: function() {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            this.newCard = this.newCard.trim();
            this.newDescrip = this.newDescrip.trim();
            if (this.newCard) {
                itemsRef.push({
                    name: this.newCard,
                    items: [],
                    l: 0,
                    cmodal: false,
                    color: this.newCardCol,
                    descrip: this.newDescrip,
                    headcol: this.newCardCol,
                    hide: false,
                    edit: false,
                    collapse: "collapse",
                    dis: "",
                    date: datetime,
                    isAddingLink: false,
                    category: this.newCat,
                    show: "",
                    catcheck: false,
                    
                });
                this.newCard = '';
                this.newDescrip = '';
                this.newCat = '';
                this.newCardCol = '';
            }
        },
        //add a card to list
        addListItem: function(card, item, oth){
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'added todo',
                todo: this.newTodo,
                date: datetime
            });
            card.l += 1;
            itemsRef.child(card['.key']).update({ l: card.l});
            var currentdate2 = new Date();
            var datetime2 = currentdate2.getMonth()+1 + "/" + currentdate2.getDate() + "/" + currentdate2.getFullYear();
                itemsRef.child(card['.key']).child('items').push({
                        item: this.newTodo,
                        due: this.newDue,
                        color: this.newColor,
                        d: this.newD,
                        cate: this.newTodoCat,
                        tmodal: false,
                        date: datetime2,
                        edit: false,
                        l: 0,
                        checked: false,
                        incaitems: [],
                        incatodos: [],
                        inUsr: [],
                        showT: "",
                        catTcheck: true
                    });
                    this.newTodo = '';
                    this.newDue = '';
                    this.newD = '';
                    this.newColor = 'white';
                    this.newTodoCat = '';
        },
        //add a comment to a list
        addInnerListItem: function(card, index) {
            itemsRef.child(card['.key']).child('initems').push({
                initem: this.newInLi,
                
            });
            this.newInLi = '';
        },
        //add a user to a card
        addInnerUser: function(users, card, todo, idx) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'added user to todo',
                todo: todo.item,
                date: datetime
            });
            for(var user of users) {
                if(this.inUsr == user.email) {
                    itemsRef.child(card['.key']).child('items').child(idx).child('inusr').push({
                        name: user.name,
                        email: user.email
                    });
                    this.inUsr = '';
                }
            }
        },
        //add a comment to a card
        addInnerCardItem: function(card, todo, index) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'added inner todo comment',
                todo: todo.item,
                date: datetime
            });
            itemsRef.child(card['.key']).child('items').child(index).child('incaitems').push({
                incaitem: this.newInCaLi,
                user: this.Name
            });
            this.newInCaLi = '';
        },
        //add a todo to a card
        addInnerTodo: function(card, todo, i) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'added card todo item',
                todo: todo.item,
                date: datetime
            });
            todo.l += 1;
            itemsRef.child(card['.key']).child('items').child(i).update({ l: todo.l});
            itemsRef.child(card['.key']).child('items').child(i).child('incatodos').push({
                incatodo: this.newInTodo
            });
            this.newInTodo = '';
        },
        //remove a list
        removeCard: function(card){
            itemsRef.child(card['.key']).remove();
        },
        //remove a card
        removeListItem: function(card, item, index, i) {  
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'removed todo',
                todo: item.item,
                date: datetime
            });
            card.l -= 1;
            itemsRef.child(card['.key']).update({ l: card.l});
            itemsRef.child(card['.key']).child('items').child(i).remove();
        },
        //move a list left
        cardLeft: function(cards2, cards, card, index) {
            if(card.cindex !== 0) {
                var temp = cards[index];
                cards.splice(index, 1, cards[index-1]);
                cards.splice(index - 1, 1, temp);
                for(var card of cards) {
                    if(card.items === undefined) {
                        card.items = [];
                    }
                    twoitemsRef.push({
                    name: card.name,
                    cmodal: card.cmodal,
                    l: card.l,
                    color: card.color,
                    descrip: card.descrip,
                    headcol: card.headcol,
                    hide: card.hide,
                    edit: card.edit,
                    collapse: card.collapse,
                    dis: card.dis,
                    date: card.date,
                    isAddingLink: card.isAddingLink,
                    items: card.items,
                    category: card.category,
                    show: card.show,
                    });
                }
                itemsRef.remove();
                for(var card of cards2) {
                    if(card.items === undefined) {
                        card.items = [];
                    }
                    itemsRef.push({
                    name: card.name,
                    cmodal: card.cmodal,
                    color: card.color,
                    l: card.l,
                    descrip: card.descrip,
                    headcol: card.headcol,
                    hide: card.hide,
                    edit: card.edit,
                    collapse: card.collapse,
                    dis: card.dis,
                    date: card.date,
                    isAddingLink: card.isAddingLink,
                    items: card.items,
                    category: card.category,
                    show: card.show,
                    });
                }
                twoitemsRef.remove();
            }
        },
        //move a list right
        cardRight: function(cards2, cards, card, index) {

            if(card.cindex != (this.cards.length - 1)) {
                var temp = cards[index];
                cards.splice(index, 1, cards[index+1]);
                cards.splice(index + 1, 1, temp);
                for(var card of cards) {
                    if(card.items === undefined) {
                        card.items = [];
                    }
                    twoitemsRef.push({
                    name: card.name,
                    cmodal: card.cmodal,
                    l: card.l,
                    color: card.color,
                    descrip: card.descrip,
                    headcol: card.headcol,
                    hide: card.hide,
                    edit: card.edit,
                    collapse: card.collapse,
                    dis: card.dis,
                    date: card.date,
                    isAddingLink: card.isAddingLink,
                    items: card.items,
                    category: card.category,
                    show: card.show
                    });
                }
                itemsRef.remove();
                for(var card of cards2) {
                    if(card.items === undefined) {
                        card.items = [];
                    }
                    itemsRef.push({
                    name: card.name,
                    items: card.items,
                    cmodal: card.cmodal,
                    l: card.l,
                    color: card.color,
                    descrip: card.descrip,
                    headcol: card.headcol,
                    hide: card.hide,
                    edit: card.edit,
                    collapse: card.collapse,
                    dis: card.dis,
                    date: card.date,
                    isAddingLink: card.isAddingLink,
                    category: card.category,
                    show: card.show
                    });
                    
                }
                twoitemsRef.remove();

            }
        },
        //move a card right
        listItemRight: function(cards, card, cindex, item, tindex) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'moved todo right',
                todo: item.item,
                date: datetime
            });
            if(cindex<cards.length) {
            console.log(cindex);
            for (var x of cards) {
                if (cards.indexOf(x) == cindex +1) {
                    var c2 = x;
                }
            }
            itemsRef.child(card['.key']).child('items').child(tindex).once("value").then(function(snapshot) {
                const c = snapshot.val();
                itemsRef.child(c2['.key']).child('items').push(c);
                c2.l += 1;
                itemsRef.child(c2['.key']).update({ l: c2.l});
                card.l -= 1;
                itemsRef.child(card['.key']).update({ l: card.l});
                itemsRef.child(card['.key']).child('items').child(tindex).remove();
            }); 
            }
        },
        //move a card left
        listItemLeft: function(cards, card, cindex, item, tindex) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'moved todo left',
                todo: item.item,
                date: datetime
            });
            if(cindex!==0) {
            console.log(cindex);
            for (var x of cards) {
                if (cards.indexOf(x) == cindex -1) {
                    var c2 = x;
                }
            }
            itemsRef.child(card['.key']).child('items').child(tindex).once("value").then(function(snapshot) {
                const c = snapshot.val();
                itemsRef.child(c2['.key']).child('items').push(c);
                c2.l += 1;
                itemsRef.child(c2['.key']).update({ l: c2.l});
                card.l -= 1;
                itemsRef.child(card['.key']).update({ l: card.l});
                itemsRef.child(card['.key']).child('items').child(tindex).remove();
            }); 
            }
        },
        //todo categories
        todoCats: function(cards) {
            var tSet = new Set([]);
            var tCats = [];
            for(var card of cards) {
                    for (var key in card) {
                        if(key=='items') {
                            for(var k in card[key]) {
                                tSet.add(card[key][k].cate);
                            }
                        }                        
                    }
                }            
            for(var x of tSet) {
                tCats.push(x);
            }
            return tCats;
        },
        //checkbox monitor that shows/hides based on categories
        checkTCat: function(cat, cards) {
            for(var card of cards) {
                    for (var key in card) {
                        if(key=='items') {
                            for(var k in card[key]) {
                                if(cat == card[key][k].cate) {
                                    card[key][k].catTcheck = !card[key][k].catTcheck;
                                    itemsRef.child(card['.key']).child('items').child(k).update({ catTcheck : card[key][k].catTcheck});
                                }
                            }
                        }                        
                    }
                }
            for(var card of cards) {
                    for (var key in card) {
                        if(key=='items') {
                            for(var k in card[key]) {
                                if(!card[key][k].catTcheck) {
                                    itemsRef.child(card['.key']).child('items').child(k).update({ showT : "none"});
                                }
                                else {
                                    itemsRef.child(card['.key']).child('items').child(k).update({ showT : ""});
                                }
                            }
                        }
                    }
                }
        },
        //check/remove a todo from a card
        checkTodoBox: function(incatodo, x, todo, i, card) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'checked inner todo',
                todo: todo.item,
                date: datetime
            });
            incatodo.checked = !incatodo.checked;
            if(incatodo.checked) {
                todo.l -= 1;
                itemsRef.child(card['.key']).child('items').child(i).update({ l: todo.l});
                itemsRef.child(card['.key']).child('items').child(i).child('incatodos').child(x).remove();
            }
            if(!incatodo.checked) {
                todo.l += 1;
                itemsRef.child(card['.key']).child('items').child(i).update({ l: todo.l});
            }
        },
        //checked off a card
        checkCardBox: function(item, card, i) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'checked todo',
                todo: item.item,
                date: datetime
            });
            item.checked = !item.checked;
            if(item.checked) {
                card.l -= 1;
                itemsRef.child(card['.key']).update({ l: card.l});
                itemsRef.child(card['.key']).child('items').child(i).update({ checked: item.checked});
            }
            if(!item.checked) {
                card.l += 1;
                itemsRef.child(card['.key']).update({ l: card.l});
                itemsRef.child(card['.key']).child('items').child(i).update({ checked: item.checked});
            }
        },
        //checked off a category and filtered lists by checked categories
        checkCatBox: function(cat, cards) {
            for(var x of cards) {
                if(x.category == cat.title) {
                    x.catcheck = !x.catcheck;
                }
            }
            for(var x of cards) {
                if(!x.catcheck) {
                    x.show = '';
                }
                else {
                    x.show = 'none';
                }
            }
        },
        //not completed: filter lists by date
        filterDate: function(cards) {
            this.filDate = this.filDate.trim();
            console.log(this.filDate)
            if(this.filDate){
                for(var card of cards) {
                        for (var key in card) {
                            if(key=='items') {
                                for(var k in card[key]) {
                                    if(this.filDate == card[key][k].date) {
                                        card[key][k].catTcheck = !card[key][k].catTcheck;
                                        itemsRef.child(card['.key']).child('items').child(k).update({ catTcheck : card[key][k].catTcheck});
                                    }
                                }
                            }                        
                        }
                    }
                for(var card of cards) {
                        for (var key in card) {
                            if(key=='items') {
                                for(var k in card[key]) {
                                    if(!card[key][k].catTcheck) {
                                        itemsRef.child(card['.key']).child('items').child(k).update({ showT : ""});
                                    }
                                    else {
                                        itemsRef.child(card['.key']).child('items').child(k).update({ showT : "none"});
                                    }
                                }
                            }
                        }
                    }
                }

        },
        showAll: function(cards) {
            for(var card of cards) {
                for (var key in card) {
                    if(key=='items') {
                        for(var k in card[key]) {
                                itemsRef.child(card['.key']).child('items').child(k).update({ catTcheck : true});
                                itemsRef.child(card['.key']).child('items').child(k).update({ showT : ""});
                            
                        }
                    }                        
                }
            }
        },
        //toggle the list modals
        toggleCModal: function(card) {
            card.cmodal = !card.cmodal;
        },
        //toggle the card modals
        toggleTModal: function(todo) {
            todo.tmodal = !todo.tmodal;
        },
        //collapse/expand list contents
        hideList: function(card) {
            card.hide = !card.hide;
            if(card.hide) {
                card.collapse = "expand";
                card.dis = 'none';
            }
            else {
                card.collapse = "collapse";
                card.dis = '';
            }
            
        },
        //storeImage functions borrowed heavily from Duvall's examples
        storeImage: function(users, random) {
            for(var x of random) {
                if(x['.key'] === 'sbcol') {
                    this.sbcol = x['.value'];
                }
                if(x['.key'] === 'bgcol') {
                    this.bgcol = x['.value'];
                }
                if(x['.key'] === 'bgimg') {
                    this.bgimg = x['.value'];
                }
            }
            // get input element user used to select local image
            var input = document.getElementById('files');
            // have all fields in the form been completed
            if (input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('userimages/' + file.name)
                          .put(file)
                          .then(snapshot => this.addUser(users, this.Name, this.Email, snapshot.downloadURL));
                // reset input values so user knows to input new data
            }
        },
        //store image for the card
        storeImageLi: function(name, index, todo) {
            // get input element user used to select local image
            var input = document.getElementById('infiles');
            // have all fields in the form been completed
            if (input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('liimages/' + file.name)
                          .put(file)
                          .then(snapshot => this.addImg(name, this.newImgTitle, snapshot.downloadURL, index, todo));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        //edit the user's image
        editUImg: function(users) {
            // get input element user used to select local image
            var input = document.getElementById('profiles');
            // have all fields in the form been completed
            if (input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('userimages/' + file.name)
                          .put(file)
                          .then(snapshot => this.addImgSimple(users, snapshot.downloadURL));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        //update with the edited user image
        addImgSimple: function(users, img) {
            for(var user of users){
                if(user.name == this.Name && user.email == this.Email) {
                    userRef.child(user['.key']).update({ image: img});
                }
            }
            this.Image = img;
        },
        //eadd bg img
        SetbgImg: function(users, random) {
            // get input element user used to select local image
            var input = document.getElementById('bgimgs');
            // have all fields in the form been completed
            if (input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('bgimgs/' + file.name)
                          .put(file)
                          .then(snapshot => this.addImgBg(random, snapshot.downloadURL));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        //add bg image
        addImgBg: function(random, img) {
            
            randomRef.update({
                bgimg: img
            });
            this.bgimg = img;
        },
        //adds a new image
        addImg: function(name, title, url, index, todo) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: name,
                action: 'added todo image',
                todo: todo.item,
                date: datetime
            });
            // now that image has been stored in Firebase, create a reference to it in database
            if(this.newImgTitle) {
            imgRef.push({
                cardname: name,
                listelement: todo,
                lindex: index,
                title: title,
                url: url
            });
            // reset input values so user knows to input new data
            this.newImgTitle = '';
            }
        },
        //adds a new user
        addUser: function(users, name, email, image) {
            if (this.Email && this.Name) {
                var count = 0;
                for(var user of users) {
                    if(user.email == this.Email && user.name == this.Name) {
                        count += 1;
                    }
                }
                if(count === 0){
                        userRef.push({
                            email: email,
                            name: name,
                            image: image,
                            edit: false
                        });
                }
            }
                this.Image = image;
                this.startscreen = false;
        },
        //allows for editing user name and email
        userEdit: function(users) {
            this.userE = !this.userE;
            for(var user of users) {
                if(this.Name == user.name && this.Email == user.email) {
                    userRef.child(user['.key']).update({ 
                        edit: this.userE,
                        name: this.Name2,
                        email: this.Email2
                    });
                    this.Name = this.Name2;
                    this.Email = this.Email2;
                    this.Name2 = '';
                    this.Email2 = '';
                }
            }
        },
        //allows a user to sign in
        SignIn: function(users, random) {
            for(var user of users) {
                if(user.email == this.Usr) {
                    this.Name = user.name;
                    this.Email = user.email;
                    this.Image = user.image;
                    this.startscreen = false;
                }
            }
            for(var x of random) {
                if(x['.key'] === 'sbcol') {
                    this.sbcol = x['.value'];
                }
                if(x['.key'] === 'bgcol') {
                    this.bgcol = x['.value'];
                }
                if(x['.key'] === 'bgimg') {
                    this.bgimg = x['.value'];
                }
            }
        },
        //edit card name
        todoEdit: function(card, todo, i) {
            var currentdate = new Date();
            var datetime = currentdate.getMonth()+1 + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
            activitiesRef.push({
                card: card.name,
                action: 'edited todo',
                todo: todo.item,
                date: datetime
            });
            todo.edit = !todo.edit;
            itemsRef.child(card['.key']).child('items').child(i).update({ item: todo.item});
        },
        //edit list name
        cardEdit: function(card) {
            card.edit= !card.edit;
            itemsRef.child(card['.key']).update({ name: card.name});
        },
        //change the layout from horizontal/vertical
        changeLayout: function() {
            if(this.vertical) {
                this.dis = 'flex';
                this.vertical = false;
            }
            else {
                this.dis = '';
                this.vertical = true;
            }
        },
    }
});
// mount
todoApp.$mount('#todoapp');