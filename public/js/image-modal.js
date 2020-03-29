Vue.component("image-modal", {
    template: "#tmpl",
    props: ["id"],

    data: function() {
        return {
            imageInfos: "",
            url: "",
            title: "",
            description: "",
            username: "",
            comments: [],
            comment: "",
            image_id: "",
            created_at: ""
        };
    },

    // watch: {
    //     setId: function() {}
    // },

    mounted: function() {
        var self = this;

        console.log("this.id", this.id);
        console.log("imageInfos", self.imageInfos);

        //req for image infos
        axios
            .get("/image/" + self.id)
            .then(function(resp) {
                //lets not show an empty page but close the modal instead

                self.imageInfos = resp.data.rows[0];
            })
            .catch(function(err) {
                console.log("err in get image ", err);
                //or close the modal HERE
            });

        //req for comments
        axios
            .get("/comments/" + self.id)
            .then(function(resp) {
                //lets not show an empty page but close the modal instead

                self.comments = resp.data.rows;
            })
            .catch(function(err) {
                console.log("err in get comments in image modal", err);
                //or close the modal HERE
            });
    },

    methods: {
        pleaseclosemodal: function() {
            console.log("this is closeModal", this);
            this.$emit("pleaseclosemodal");
        },

        handleCommentClick: function(e) {
            e.preventDefault();
            //We create an object and insert it into
            var comment = {};
            comment.id = this.id;
            comment.username = this.username;
            comment.comment = this.comment;

            //posting a comment
            var self = this;
            axios
                .post("/comment/", comment)
                .then(function(comment) {
                    self.comments.unshift(comment);
                    self.image_id = this.id;
                })
                .catch(function(err) {
                    console.log("err in post comment ", err);
                });
        },

        deleteImage: function() {
            console.log("this in delete image in modql", this);
            var self = this;
            axios
                .post("/delete/" + this.id)
                .then(function(resp) {
                    console.log("resp on delete image in modal", resp);

                    self.image_id = this.id;
                    console.log(
                        "self.image_id in deleteimqge modql",
                        self.image_id
                    );
                    self.pleaseclosemodal();
                })
                .catch(err => {
                    console.log("err in delete image", err);
                });
        }
    } // methods
});
