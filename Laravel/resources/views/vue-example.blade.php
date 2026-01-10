<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vue.js Example - Laravel</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="app" style="max-width: 800px; margin: 50px auto; padding: 20px;">
        <h1 style="text-align: center; color: #333; margin-bottom: 30px;">
            Laravel + Vue.js
        </h1>
        <example-component></example-component>
    </div>
</body>
</html>
