Vue.component("image-modal", {
    template: "#tmpl",
    props: ["currentImageId"],

    data: function() {
        return {
            title: "",
            description: "",
            username: ""
        };
    }

    // mounted: function() {
    //     axios
    //         .get("/image/" + this.id)
    //         .then(function(resp) {
    //             console.log("resp from get req in image modal: ", resp);
    //             db.getImage(this.id).then(data => {
    //                 // this.description =
    //             });
    //         })
    //         .catch(function(err) {
    //             console.log("err in POST /upload: ", err);
    //         });
    // },
    //with data, as we can have multiple components, we cannot name it data and make it an object, we make it a function that returns an object so that every component will have their own state; when the component is created, it runs the function

    // methods: {
    //     closeModal: function(e) {
    //         this.$emit("closeModal", this.id, e.target.value);
    //     }
    // }
});
