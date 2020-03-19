# js-starter
Extra light lib to load content

## Installation

Install package with that command
```
yarn add js-starter
```

and add resources in your html, for exemple :
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/node_modules/js-starter/public/dist/app.css" />
    </head>
    <body>
        <!-- your content -->
        <script>
            window.__ENV__ = {
                resources: {
                    'css': '/build/my.css',
                    'react': '/node_modules/react/umd/react.production.min.js'',
                    'react-dom': '/node_modules/react-dom/umd/react-dom.production.min.js',
                    'js': '/build/app.js'
                }
            }
        </script>

        <script src="/node_modules/js-starter/public/dist/app.js"></script>
    </body>
</html>
```
