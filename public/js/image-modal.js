Vue.component("image-modal", {
    template: "#tmpl",
    props: ["currentImageId"],

    data: function() {
        return {
            id: this.currentImageId,
            title: "",
            description: "",
            username: "",
            comments: []
        };
    },

    watch: {
        currentImageId: function() {}
    },

    mounted: function() {
        var self = this;

        //req for image infos
        axios
            .get("/image/" + this.id)
            .then(function(resp) {
                //lets not show an empty page but close the modal instead
                console.log("resp from get req in image modal: ", resp);
                self.imageInfos = resp.data;
            })
            .catch(function(err) {
                console.log("err in get image ", err);
                //or close the modal HERE
            });
        //req for comments
        axios
            .get("/comments/" + this.id)
            .then(function(resp) {
                console.log("resp from get req in image modal: ", resp);
                self.comments = resp.data;
            })
            .catch(function(err) {
                console.log("err in get comments ", err);
            });
    }

    // methods: {
    //     closeModal: function(e) {
    //         this.$emit("closeModal", this.id, e.target.value);
    //     }
    // }
});
