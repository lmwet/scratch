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
                console.log(
                    "resp.data.rows[0] from get req in image modal: ",
                    resp.data.rows[0]
                );
                self.imageInfos = resp.data.rows[0];
            })
            .catch(function(err) {
                console.log("err in get image ", err);
                //or close the modal HERE
            });
    },

    methods: {
        closeModal: function(e) {
            this.$emit("closeModal", this.id, e.target.value);
        },

        handleCommentClick: function(e) {
            e.preventDefault();

            // 'this' allows me to see all the properties of data
            console.log("this in click comment ", this);

            //req for posting a comment
            axios
                .post("/comment/" + this.id) // not running
                .then(function(resp) {
                    console.log(
                        "resp from post comment in image modal: ",
                        resp
                    );

                    console.log("this in post comment", this);
                    self.comments = resp.data.rows[0];
                    self.comments.unshift(resp.data.rows[0]);
                    console.log(
                        "comments array after post comment",
                        self.comments
                    );
                    self.image_id = this.id;
                    // created_at: ""
                })
                .catch(function(err) {
                    console.log("err in post comment ", err);
                });
        }

        // handleChange: function(e) {
        //     //For the file input, you will have to handle the "change" event and manually set a property on the instance to contain the file.
        //     this.file = e.target.files[0];
        // }
    } // methods
});
