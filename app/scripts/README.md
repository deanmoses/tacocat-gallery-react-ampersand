This directory contains the app's custom javascripts, React JSX scripts, and other types of scripts.   Third party libraries are elsewhere.

Before being deployed to production, a build process happens in development that compiles the JSX, combines all the scripts into a single file, and minifies it.

This processing happens via the gulp.js build system.  The entire build process is defined in gulpfile.js.