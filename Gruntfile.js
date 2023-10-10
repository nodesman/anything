const { execSync } = require('child_process');

module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            dist: {
                src: ['dist/*']
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['*.js', '!Gruntfile.js', '!background.js', '!content.js', '!popup.js'],
                dest: 'dist/content.js',
            },
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'dist/content.min.js': ['dist/content.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['background.js'], dest: 'dist/'},
                    {expand: true, src: ['manifest.json'], dest: 'dist/'},
                    {expand: true, src: ['popup.html'], dest: 'dist/'},
                    {expand: true, src: ['popup.js'], dest: 'dist/'},
                    {expand: true, src: ['rules.json'], dest: 'dist/'},
                ],
            },
            sites: {
                expand: true,
                cwd: 'sites/',
                src: '**',
                dest: 'dist/sites/'
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('web_ext_run', 'Run web-ext', function() {
        const done = this.async();
        try {
            execSync('cd dist && web-ext run --target chromium');
            done();
        } catch (err) {
            grunt.log.error(err);
            done(false);
        }
    });

    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy']);
};
