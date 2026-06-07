<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>@yield('title', 'Lufra 2020')</title>

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" crossorigin="anonymous">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/utilities.css') }}">
    @stack('styles')
    
    <script>
        (function() {
            // Apply theme on html element immediately to prevent flash
            if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark-mode');
            }
            if (localStorage.getItem('density') === 'compact') {
                document.documentElement.classList.add('compact');
            }
            // Set accent color variables on html element
            const pc = localStorage.getItem('primaryColor') || 'charcoal';
            const cmap = {
                'charcoal': ['#333333', '#000000'],
                'steel': ['#4a5568', '#2d3748'],
                'stone': ['#718096', '#4a5568']
            };
            if (cmap[pc]) {
                document.documentElement.style.setProperty('--primary', cmap[pc][0]);
                document.documentElement.style.setProperty('--primary-hover', cmap[pc][1]);
            }
        })();
    </script>
</head>
<body>
    <script>
        (function() {
            // Apply classes on body element
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark-mode');
            }
            if (localStorage.getItem('density') === 'compact') {
                document.body.classList.add('compact');
            }
            // Set accent color variables on body element
            const pc = localStorage.getItem('primaryColor') || 'charcoal';
            const cmap = {
                'charcoal': ['#333333', '#000000'],
                'steel': ['#4a5568', '#2d3748'],
                'stone': ['#718096', '#4a5568']
            };
            if (cmap[pc]) {
                document.body.style.setProperty('--primary', cmap[pc][0]);
                document.body.style.setProperty('--primary-hover', cmap[pc][1]);
            }
        })();
    </script>
    @yield('content')
    <script src="{{ asset('js/script.js') }}"></script>
    @auth
        <script>
            window.laravelUser = {
                id: "{{ auth()->user()->id }}",
                name: "{{ auth()->user()->name }}",
                role: "{{ auth()->user()->role }}"
            };
        </script>
        <script src="{{ asset('js/session-timeout.js') }}"></script>
    @endauth
    @stack('scripts')
</body>
</html>
