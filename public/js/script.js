(function() {
    new Vue({
        el: "#main",
        data: {
            name: "Daily Sketch", //any info that we want to be updated instantly
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            currentImageId: null
        }, // watch out: COMA  data

        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                // console.log("response from /images: ", response.data.rows);
                self.images = response.data.rows;
            });
        },

        methods: {
            handleClick: function(e) {
                e.preventDefault();
                // 'this' allows me to see all the properties of data
                // console.log("this! ", this); //this contains the filename

                // we NEED to use FormData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                let self = this;

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        // console.log("resp from POST /uplaod: ", resp);
                        self.images.unshift(resp.data.rows[0]);
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function(e) {
                //For the file input, you will have to handle the "change" event and manually set a property on the instance to contain the file.
                this.file = e.target.files[0];
            },

            //the click on the image sent an event to set the prop currentImageId as the current image one
            openModal: function(e) {
                e.preventDefault();
                console.log("this in openModal ", this);
                console.log("e.target", e.target); // i get the url

                axios
                    .get("/image")
                    .then(function(response) {
                        // console.log("response from /images: ", response.data.rows);
                        this.currentImageId = response.data.rows[0].id; // what should i do here to get the image id, a db query???
                    })
                    .catch(function(err) {
                        console.log("err in post /image: ", err);
                    });
            },
            closeModal: function(e) {
                e.preventDefault();
                this.currentImageId = null;
            }
        } //closes methods
    });
})();
