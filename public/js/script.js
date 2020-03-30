(function() {
    new Vue({
        el: "#main",
        data: {
            name: "*Sketch Scratch'", //any info that we want to be updated instantly
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            imageId: location.hash.slice(1),
            lastId: ""
        }, //data

        mounted: function() {
            var self = this;

            addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);
            });

            //get all images
            axios.get("/images").then(function(response) {
                self.images = response.data.rows;
                console.log("self.images from /images: ", self.images);
                console.log(response.data.rows);
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
                        var form = document.querySelector("#main-form");
                        form.reset();
                    })
                    .catch(function(err) {
                        console.log("err in POST /upload: ", err);
                    });
                var form = document.querySelector("#main-form");
                form.reset();
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
            closemodal: function() {
                location.hash = "";
                history.replaceState(null, null, " ");
            },
            grabMore: function() {
                console.log("grabmore runnin");
                let self = this;
                // getting lastimage's id on screen and setting its value to lastId data prop
                self.lastId = self.images[self.images.length - 1].id;
                console.log("self.lastId from /images: ", self.lastId);
                axios
                    .get("/more/" + self.lastId)
                    .then(function(resp) {
                        console.log("response from get /more: ", resp.data);
                        self.images = resp.data;
                        console.log("self.images from /more: ", self.images);
                        console.log(
                            "self.images[0].lowestId",
                            self.images[0].lowestId
                        );

                        const smallestId = self.images.find(
                            ({ id }) => id === self.images[0].lowestId
                        );
                        console.log("smallestId", smallestId);

                        if (smallestId != undefined) {
                            const moreButton = document.getElementById("more");
                            console.log(moreButton);
                            moreButton.style.display = "none";
                        }
                    })
                    .catch(function(err) {
                        console.log("err in get more script: ", err);
                    });
            }
        } //closes methods
    });
})();
