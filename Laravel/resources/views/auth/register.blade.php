<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Crear Cuenta</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css">
    <style>
        .register-page {
            background: #f4f6f9;
        }
        .register-logo {
            display: none;
        }
        .card {
            border: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .register-card-body {
            padding: 2rem;
        }
        .register-header {
            text-align: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e9ecef;
        }
        .register-header img {
            max-height: 60px;
            margin-bottom: 10px;
        }
        .register-header .brand-text {
            color: #343a40;
            font-size: 1.25rem;
            font-weight: 600;
            display: block;
            margin-bottom: 5px;
        }
        .register-header .company-info {
            color: #6c757d;
            font-size: 0.75rem;
            display: block;
            margin-bottom: 2px;
        }
        .login-box-msg {
            font-size: 1rem;
            color: #6c757d;
            margin-bottom: 1.5rem;
        }
        .btn-primary {
            background: #007bff;
            border: none;
            padding: 0.6rem 1rem;
        }
        .btn-primary:hover {
            background: #0056b3;
        }
    </style>
</head>
<body class="hold-transition register-page">
<div class="register-box">
    <div class="card">
        <div class="card-body register-card-body">
            <div class="register-header">
                @if(config('settings.image'))
                    <img src="{{ asset('storage/settings/') }}/{{ config('settings.image') }}" alt="Logo">
                @endif
                <span class="brand-text">
                    {{ config('settings.app_name', config('app.name', 'Sistema de Nóminas')) }}
                </span>
                @if(config('settings.register_number'))
                    <small class="company-info"><i class="fas fa-id-card mr-1"></i>{{ config('settings.register_number') }}</small>
                @endif
                @if(config('settings.app_email'))
                    <small class="company-info"><i class="fas fa-envelope mr-1"></i>{{ config('settings.app_email') }}</small>
                @endif
            </div>

            <p class="login-box-msg text-center"><i class="fas fa-user-plus mr-2"></i>Crea tu cuenta</p>

            @if($errors->any())
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <ul class="mb-0 pl-3">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('register.post') }}">
                @csrf
                <div class="form-group">
                    <label for="name" class="small text-muted">Nombre Completo</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                        </div>
                        <input id="name" name="name" value="{{ old('name') }}" class="form-control @error('name') is-invalid @enderror" placeholder="Juan Pérez" required autofocus>
                    </div>
                    @error('name')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="email" class="small text-muted">Correo Electrónico</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                        </div>
                        <input id="email" name="email" type="email" value="{{ old('email') }}" class="form-control @error('email') is-invalid @enderror" placeholder="correo@ejemplo.com" required>
                    </div>
                    @error('email')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password" class="small text-muted">Contraseña</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                        </div>
                        <input id="password" name="password" type="password" class="form-control @error('password') is-invalid @enderror" placeholder="Mínimo 8 caracteres" required>
                    </div>
                    @error('password')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password_confirmation" class="small text-muted">Confirmar Contraseña</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                        </div>
                        <input id="password_confirmation" name="password_confirmation" type="password" class="form-control @error('password_confirmation') is-invalid @enderror" placeholder="Repite tu contraseña" required>
                    </div>
                    @error('password_confirmation')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg">
                    <i class="fas fa-user-plus mr-2"></i>Crear Cuenta
                </button>
            </form>

            <hr class="my-3">

            <p class="text-center mb-0 small">
                ¿Ya tienes cuenta? <a href="{{ route('login') }}" class="font-weight-bold">Inicia sesión aquí</a>
            </p>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
</body>
</html>
