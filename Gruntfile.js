/**
 * Build process for CKEditor AutoSave Plugin
 * This file contributed by Timm Stokke <timm@stokke.me>
 *
 * Don't know where to start?
 * Try: http://24ways.org/2013/grunt-is-not-weird-and-hard/
 */
module.exports = function(grunt) {

    // CONFIGURATION
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // Minimize JS
        uglify: {
            minify: {
                files: {
                    "oembed/libs/jquery.oembed.min.js": "oembed/libs/jquery.oembed.js"

                }
            }
        },
        devUpdate: {
            main: {
                options: {
                    reportUpdated: true,
                    updateType: "force",
                    semver: false
                }
            }
        }

    });

    // PLUGINS
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-dev-update");

    grunt.registerTask("default",
        [
            "devUpdate",
            "uglify"
        ]);
};
