(function() {
    new Vue({
        el: "#main",
        data: {
            name: "Daily Sketch", //any info that we want to be updated instantly
            images: [],
            title: "",
            description: "",
            username: "",
            file: null
        }, // watch out: COMA  data

        mounted: function() {
            console.log("mounting?");

            var self = this;
            axios.get("/images").then(function(response) {
                console.log("response from /images: ", response.data.rows);

                self.images = response.data.rows;
                console.log("self.images ", self.images);
            });
        },

        methods: {
            handleClick: function(e) {
                e.preventDefault();
                // 'this' allows me to see all the properties of data
                console.log("this! ", this);

                // we NEED to use FormData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from POST /uplaod: ", resp);
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function(e) {
                // console.log('handleChange is running!!!!');
                // console.log('file: ', e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
    });
})();
