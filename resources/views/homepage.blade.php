@extends('layouts.app')

@section('title', 'Homepage Lufra 2020')

@section('content')
  <header id="hero">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="container">
        <!-- Logo -->
        <h1 id="logo">
          <a href="https://github.com/UPTP-336-Proyecto-II/Lufra-2020" target="_blank">
            <img src="{{ asset('img/icono repositorio UPTP.jpg') }}" alt="Logo">
          </a>
        </h1>
        <!-- Navbar links -->
        <ul class="nav-menu">
          <li><a class="nav-link" href="#conocenos">CONÓCENOS</a></li>
          <li><a class="nav-link" href="#productos">PRODUCTOS</a></li>
          <li><a class="nav-link" href="#footer">CONTACTOS</a></li>
          <li>
            <a class="nav-link btn btn-primary" href="{{ url('login') }}">Ingresar <i class="fas fa-sign-in-alt"></i></a>
          </li>
          <div class="theme-switch">
            <input type="checkbox" id="switch" />
            <label class="toggle-icons" for="switch">
              <img class="sun" src="{{ asset('img/sun.svg') }}" />
              <img class="moon" src="{{ asset('img/moon.svg') }}" />
            </label>
          </div>
        </ul>
        <div class="hamburger">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
    </nav>
    <section class="header-container reveal">
      <img class="profile-image" src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" />
      <h1>Hola, somos Lufra 2020</h1>
      <div class="content-text">
        <h2>Venta de lubricantes, filtros y repuestos agrícolas</h2>
        <p>Somos tienda física, ubicados en Acarigua sector centro, en la calle 32 entre avenidas 37 y 38 bella vista 1.
        </p>
      </div>
      <a href="#conocenos" class="btn btn-secondary">Conócenos <i class="fas fa-chevron-down"></i></a>
    </section>
  </header>

  <section class="store-decoration reveal">
    <div class="container">
      <div class="store-image-wrapper">
        <img src="{{ asset('img/tienda-fisica.jpg') }}" alt="Nuestra Tienda Física">
        <a href="https://maps.app.goo.gl/WFhRqNYZVhfeVGcc9" target="_blank" class="store-label btn btn-primary">
          <i class="fas fa-map-marked-alt"></i>
          <span>Visítanos en Acarigua</span>
        </a>

      </div>
    </div>
  </section>

  <section id="conocenos" class="project-container container reveal">
    <div class="division"></div>
    <div class="content-text">
      <h2 style="color:var(--primary-color);" class="section-title"><i class="fas fa-info-circle"></i> ¿Quiénes somos?
      </h2>
      <p>Lufra 2020, C.A. es una empresa venezolana dedicada a la venta de aceites, filtros y misceláneos para vehículos
        livianos, camiones y maquinaria pesada. Con un enfoque en calidad, disponibilidad y atención personalizada, la
        empresa se ha consolidado como un proveedor confiable para transportistas, talleres y particulares que buscan
        soluciones rápidas y seguras para el mantenimiento de sus unidades.</p>

      <p>Además de su amplio catálogo de productos —que incluye lubricantes certificados, filtros de aire, aceite y
        combustible, así como productos complementarios para el cuidado automotriz—, Lufra 2020, C.A. también ofrece
        servicios especializados de fabricación de mangueras hidráulicas a medida y cambios de aceite, brindando una
        atención integral que responde a las necesidades del sector automotor.</p>

      <div class="mission-vision">
        <div class="mv-item reveal">
          <h2 style="color:var(--primary-color);" class="section-title"><i class="fas fa-bullseye"></i> Misión</h2>
          <p>Ofrecer productos automotrices de alta calidad, especialmente aceites, filtros, misceláneos, mangueras
            hidráulicas y servicios de cambio de aceite, que garanticen el rendimiento y la durabilidad de vehículos
            livianos y pesados.</p>
        </div>
        <div class="mv-item reveal">
          <h2 style="color:var(--primary-color);" class="section-title"><i class="fas fa-eye"></i> Visión</h2>
          <p>Ser reconocidos como la empresa líder en el occidente venezolano en la distribución de repuestos automotrices
            y prestación de servicios técnicos, destacando por su responsabilidad y variedad.</p>
        </div>
      </div>
    </div>
  </section>
  <section id="productos" class="project-container container reveal">
    <div class="division"></div>
    <div class="content-text">
      <h2 style="color:var(--primary-color);" class="section-title"><i class="fas fa-box-open"></i> Nuestros Productos
      </h2>
      <p>Explora nuestra amplia gama de productos de alta calidad para tu vehículo.</p>
    </div>
    <article class="project">
      <!-- Filtro de transmisión -->
      <div class="card reveal">
        <div class="project-info">
          <div class="project-bio">
            <h3>Filtro de transmisión</h3>
            <p>Modelo: AR94510</p>
          </div>
          <div class="project-link">
            <a title="WhatsApp"
              href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CG5Kmp5H1Xq/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==%20%F0%9F%91%88%20"
              target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a title="Instagram"
              href="https://www.instagram.com/p/CG5Kmp5H1Xq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <!-- Filtro de combustible -->
      <div class="card reveal">
        <div class="project-info">
          <div class="project-bio">
            <h3>Filtro de combustible</h3>
            <p>Modelo: RE62419</p>
          </div>
          <div class="project-link">
            <a title="WhatsApp"
              href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CGdGsdnHSVW/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ=="
              target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a title="Instagram"
              href="https://www.instagram.com/p/CGdGsdnHSVW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <!-- Filtro de aceite -->
      <div class="card reveal">
        <div class="project-info">
          <div class="project-bio">
            <h3>Filtro de aceite</h3>
            <p>Modelo: RE504836</p>
          </div>
          <div class="project-link">
            <a title="WhatsApp"
              href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CHX1DV1ngO0/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ=="
              target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a title="Instagram"
              href="https://www.instagram.com/p/CHX1DV1ngO0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <!-- Filtro de aire -->
      <div class="card reveal">
        <div class="project-info">
          <div class="project-bio">
            <h3>Filtro de aire</h3>
            <p>Modelo: AL150288</p>
          </div>
          <div class="project-link">
            <a title="WhatsApp"
              href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CHLgsxUH4Sc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a title="Instagram"
              href="https://www.instagram.com/p/CHLgsxUH4Sc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <!-- Filtro de aceite hidráulico -->
      <div class="card reveal">
        <div class="project-info">
          <div class="project-bio">
            <h3>Filtro de aceite hidráulico</h3>
            <p>Modelo: AE43494</p>
          </div>
          <div class="project-link">
            <a title="WhatsApp"
              href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CG-F2TNnf7S/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==://www.instagram.com/p/CHLgsxUH4Sc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a title="Instagram"
              href="https://www.instagram.com/p/CG-F2TNnf7S/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <!-- Aceites -->
      <div class="card reveal">
        <div class="project-info">
          <div class="project-bio">
            <h3>Lubricantes</h3>
            <p>Mineral, Sintético, Semi-sintético</p>
          </div>
          <div class="project-link">
            <a title="WhatsApp"
              href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CBoXoF5ntCq/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ=="
              target="_blank"><i class="fab fa-whatsapp"></i></a>
            <a title="Instagram"
              href="https://www.instagram.com/p/CBoXoF5ntCq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
              target="_blank"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </article>
  </section>
  <footer id="footer">
    <div class="container footer-grid reveal">
      <!-- Bio Column -->
      <div class="footer-col about">
        <h3>Lufra 2020, C.A.</h3>
        <p>Empresa líder en Venezuela dedicada a la comercialización de lubricantes, filtros y repuestos de alta calidad
          para el sector de transporte y maquinaria pesada.</p>
      </div>

      <!-- Links Column -->
      <div class="footer-col links">
        <h3>Navegación</h3>
        <ul>
          <li><a href="#hero">Inicio</a></li>
          <li><a href="#conocenos">Conócenos</a></li>
          <li><a href="#productos">Productos</a></li>
        </ul>
      </div>

      <!-- Contact Column -->
      <div class="footer-col contact">
        <h3>Encuéntranos</h3>
        <p><i class="fas fa-map-marker-alt"></i> Calle 32 entre avenidas 37 y 38, Bella Vista 1, Acarigua.</p>
        <p><i class="fas fa-phone-alt"></i> +58 412-1542114</p>
        <a href="mailto:lufra2020ca@gmail.com" class="footer-email">lufra2020ca@gmail.com</a>
      </div>
    </div>

    <div class="container footer-bottom">
      <div class="social">
        <a href="https://www.instagram.com/lufra_2020?igsh=N3h6MWtjbTJha3ly" target="_blank" title="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://wa.me/584245114575" target="_blank" title="WhatsApp">
          <i class="fab fa-whatsapp"></i>
        </a>
      </div>
      <div class="attribution">
        <a href="https://github.com/CommunityPro/portfolio-html" target="_blank" rel="noopener noreferrer">
          <img src="https://user-images.githubusercontent.com/62628408/157202263-9174da24-b19a-4017-9b7c-a1d26ae8f014.svg"
            alt="attribution" width="120px" />
        </a>
      </div>
      <p>Copyright &copy; Lufra 2020 <span id="datee"></span>. Todos los derechos reservados.</p>
    </div>
  </footer>
@endsection