const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {
        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                callback(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                callback({xhr: xhr, status: status, error: errorThrown});
            }
        });
    },
    User: {
        login: (username, password, callback) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url:"/start/login",
                method:"POST"
            }, (err, data)) => {
                if (err) return callback(err);

                SDK.Storage.persist("tokenId", data.token);
                SDK.Storage.persist("userId", data.userId);
                SDK.Storage.persist("user", data);

                callback(null, data);
            }
        },
        logOut: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/start/logout",
                data: data,
                headers: {authorization: "Bearer " + SDK.Storage.load("tokenId")}
            }, cb);
            SDK.Storage.remove("tokenId");
            SDK.Storage.remove("userId");
            SDK.Storage.remove("user");
            window.location.href = "index.html";
        },
        current: () => {
            return SDK.Storage.load("user");
        },
    },

    Order: {
        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/user/createOrder",
                data: data,
                headers: {authorization: "Bearer " + SDK.Storage.load("tokenId")}
            }, cb);
        },
        findMine: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getOrdersById/" + SDK.User.current().id,
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("tokenId")
                }
            }, cb);
        }
    },

    Storage: {
        prefix: "KantineAppSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};