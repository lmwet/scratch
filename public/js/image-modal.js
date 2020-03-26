Vue.component("image-modal", {
    template: "#tmpl",
    props: ["id"],

    data: function() {
        return {
            id: this.id,
            title: "",
            description: "",
            username: "",
            created_at: "",
            comments: []
        };
    },

    // watch: {
    //     setId: function() {}
    // },

    mounted: function() {
        var self = this;

        //req for image infos
        axios
            .get("/image/" + self.id)
            .then(function(resp) {
                //lets not show an empty page but close the modal instead
                console.log("resp from get req in image modal: ", resp);
                // self.imageInfos = resp.data;
            })
            .catch(function(err) {
                console.log("err in get image ", err);
                //or close the modal HERE
            });
        //req for comments
        axios
            .get("/comments/" + self.id)
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
