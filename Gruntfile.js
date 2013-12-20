/**
 * Created by Mike on 12/19/13.
 */

'use strict';


module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'src',
            dist: 'dist'
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            build: [
                '<%= yeoman.app %>/angularGeoFire.js'
            ]
        },

        // Empties folders to start fresh
        clean: {
            build: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            }
        },


        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: 'angularGeoFire.js',
                        dest: 'dist'
                    }
                ]
            }
        },

        uglify: {
            build: {
                options: {
                    mangle: true
                },
                files: {
                    'dist/angularGeoFire.min.js': 'dist/angularGeoFire.js'
                }
            }
        }

    });


    grunt.registerTask('build', [
        'jshint:build',
        'clean:build',
        'ngmin:build',
        'uglify:build'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
