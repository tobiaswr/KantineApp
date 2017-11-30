const SDK = {

    serverURL: "http://localhost:8080/api",
    request: (options,cb) =>{

    let headers = {};
if (options.headers) {
    Object.keys(options.headers).forEach(function (h) {
        headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
    });
}

//perform XHR
$.ajax({
    url: SDK.serverURL + options.url,
    method:options.method,
    headers: headers,
    contentType: "application/json",
    dataType: "text",
    data: SDK.Encryption.encryptDecrypt(JSON.stringify(options.data)),
    success: (data, status, xhr) => {
    cb(null, JSON.parse(SDK.Encryption.encryptDecrypt(data)), status, xhr);
},
error: (xhr, status, errorThrown) => {
    cb({xhr:xhr, status: status, error: errorThrown});
}
});
},
Orders:{
    getAll: (cb) => {
        SDK.request({
                method:"GET",
                url: "/staff/getOrders",
                data: SDK.Storage.load("user_id"),
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}
                },
            (err, data) => {
            if (err) return cb(err);

        cb(null, data);
    })
    },
    makeReady: (id, cb) => {
        SDK.request({
                method:"POST",
                url: "/staff/makeReady/"+id,
                data: SDK.Storage.load("user_id"),
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}},
            (err, data) => {
            if (err) return cb(err);
                cb(null, data);
            })
    },
    getByUserId: (cb) => {
        SDK.request({
                method:"GET",
                url: "/user/getOrdersById/"+ SDK.Storage.load("user_id"),
                data: SDK.Storage.load("user_id"),
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}
            },
            (err, data) => {
            if (err) return cb(err);
        cb(null, data);
    })
    },
    create: (items, cb) => {
        SDK.request({
                method:"POST",
                url: "/user/createOrder",
                data:
                    {
                        User_userId: SDK.Storage.load("user_id"),
                        items: items
                    },
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}},
            (err, data) => {
            if (err) return cb(err);
                cb(null, data);
            })
    }},
Items:{
    create:(itemName, itemDescription, itemPrice, cb) => {
        SDK.request({
                method:"POST",
                url:"/staff/createItem",
                data:{itemName:itemName, itemDescription:itemDescription, itemPrice:itemPrice},
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}}
            ,cb);
    },
    addToBasket: (item) => {
        let basket = SDK.Storage.load("basket");

        if (!basket) {
            return SDK.Storage.persist("basket", [{
                count: 1,
                item: item
            }]);
        }

        let foundItem = basket.find(i => i.item.itemId === item.itemId);
        if (foundItem) {
            let i = basket.indexOf(foundItem);
            basket[i].count++;
        } else {
            basket.push({
                count: 1,
                item: item
            });
        }

        SDK.Storage.persist("basket", basket);
    },
    removeFromBasket: (itemId) => {
        let basket = SDK.Storage.load("basket");
        for (let i = 0; i<basket.length; i++){
            if (basket[i].item.itemId === itemId){
                if (basket[i].count > 1){
                    basket[i].count--;
                }
                else{
                     basket.splice(i, 1);
                }
            }
        }
        SDK.Storage.persist("basket", basket);
    },
    getAll: (cb) => {
        SDK.request({
                method:"GET",
                url: "/user/getItems",
                data: SDK.Storage.load("user_id"),
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}},
            (err, data) => {
            if (err) return cb(err);

        cb(null, data);
    })
    }
    },
Users:{
    create:(username, password, cb) => {
        SDK.request({
                method:"POST",
                url:"/user/createUser",
                data: {
                    username:username,
                    password:password
                }
        }, (err, data) => {
            if (err) return cb(err);


            cb(null, data);
            })
    },
},

    logOut: (cb) => {
    SDK.request({
        method:"POST",
        url:"/start/logout",
        headers: {
            Authorization: 'Bearer ' + SDK.Storage.load("BearerToken")
        },
        data:{
            "user_id": SDK.Storage.load("user_id")
        }},
        (err, data) => {
            if (err) return cb(err);


            cb(null, data);
        });
        SDK.Storage.remove("BearerToken");
        SDK.Storage.remove("isPersonel");
        SDK.Storage.remove("user_id");
        SDK.Storage.remove("currentUser");
},

    login: (username, password, cb) => {
    SDK.request({
        method:"POST",
        url: "/start/login",
        data: {
            username:username,
            password:password
        }},
        (err, data) => {
            if (err) return cb(err);
            SDK.Storage.persist("BearerToken", data.token);
            SDK.Storage.persist("user_id", data.user_id);
            SDK.Storage.persist("isPersonel", data.isPersonel);
            SDK.Storage.persist("currentUser", data);

            cb(null, data);

        });
},
Storage: {
    prefix: "KantineAppSDK",

    persist: (key, value) => {
        sessionStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
        const val = sessionStorage.getItem(SDK.Storage.prefix + key);
        try {
            return JSON.parse(val);
        }
        catch (e) {
            return val;
        }
    },
    remove: (key) => {
        const removeKey = SDK.Storage.prefix + key;
        sessionStorage.removeItem(removeKey);
    }
},


Encryption: {

    encryptDecrypt(input) {
        var enc = true;
        if(input != null) {
            if (enc) {
                var key = ['Y', 'O', 'L', 'O']; //Can be any chars, and any size array
                var output = [];
                for (var i = 0; i < input.length; i++) {
                    var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
                    output.push(String.fromCharCode(charCode));
                }
                return output.join("");
            }
            else {
                return input;
            }
        }
        else{
            return input;
        }
    }
}
};

