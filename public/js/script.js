console.log("linked");

(function() {
    new Vue({
        el: "#main",
        data: {
            name: "Daily Sketch", //any info that we want to be updated instantly
            images: []
        }, // !!! COMA closes data

        mounted: function() {
            console.log("mounting?");

            var self = this;
            axios.get("/images").then(function(response) {
                console.log("response from /images: ", response.data);

                self.images = response.data;
                console.log("self.images ", self.images);
            });
        }

        // methods: {
        //     myFunction: function() {
        //         console.log("bei mir laufts");
        //     } //myFunction
        // } //methods
    });
})();
