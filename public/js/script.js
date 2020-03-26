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
            imageId: location.hash.slice(1),
            imageInfos: []
        }, //data

        mounted: function() {
            var self = this;

            addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);
            });

            //get all images
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

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                let self = this;

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
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

            //the click on the image sent an event to set the prop imageId as the current image one
            openModal: function(imageId) {
                this.imageId = imageId;
                console.log("this in Openmodal", this); // working!!
            },
            closeModal: function() {
                location.hash = "";
                history.replaceState(null, null, " ");
            }
        } //closes methods
    });
})();
