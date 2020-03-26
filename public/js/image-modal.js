Vue.component("image-modal", {
    template: "#tmpl",
    props: ["id"],

    data: function() {
        return {
            imageInfos: [],
            url: "",
            title: "",
            description: "",
            username: "",
            comments: [],
            text: "",
            image_id: "",
            created_at: ""
        };
    },

    // watch: {
    //     setId: function() {}
    // },

    mounted: function() {
        var self = this;

        console.log("this.id", this.id); // now = image_id
        console.log("imageInfos", this.imageInfos);

        //req for image infos
        axios
            .get("/image/" + self.id)
            .then(function(resp) {
                //lets not show an empty page but close the modal instead
                console.log("resp from get req in image modal: ", resp);
                self.imageInfos = resp.data[0];
            })
            .catch(function(err) {
                console.log("err in get image ", err);
                //or close the modal HERE
            });

        //req for get comments
        axios
            .get("/comments/" + self.id)
            .then(function(resp) {
                console.log("resp from get comments in img-modal: ", resp);
                self.comments = resp.data.rows[0];
            })
            .catch(function(err) {
                console.log("err in get comments ", err);
            });

        //req for posting a comment
        axios
            .post("/comment/" + self.id)
            .then(function(resp) {
                console.log("resp from get req in image modal: ", resp);
                self.comments.unshift(resp.data.rows[0]);
            })
            .catch(function(err) {
                console.log("err in post comment ", err);
            });
    }

    // methods: {
    //     closeModal: function(e) {
    //         this.$emit("closeModal", this.id, e.target.value);
    //     }
    // }
});
