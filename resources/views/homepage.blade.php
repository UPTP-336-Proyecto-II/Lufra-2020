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
        <li><a class="nav-link" href="#"></a></li>
        <li>
          <a class="nav-link btn btn-primary" href="{{ url('login') }}">Ingresar <i class="fas fa-arrow-right"></i></a>
        </li>
        <div class="theme-switch">
          <input type="checkbox" id="switch" />
          <label class="toggle-icons" for="switch">
            <img class="moon" src="{{ asset('img/moon.svg') }}" />
            <img class="sun" src="{{ asset('img/sun.svg') }}" />
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
  <section class="header-container">
    <img class="profile-image" src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" style="width: 300px; border-radius: 8px;" />
    <h1>Hola, somos Lufra 2020</h1>
    <div class="content-text">
      <h2>Venta de lubricantes, filtros y repuestos agricolas</h2>
      <br>
      <p>Somos tienda física, ubicados en Acarigua sector centro, en la calle 32 entre avenidas 37 y 38 bella vista 1.</p>
    </div>
    <a href="#conocenos" class="btn btn-secondary">Conócenos</a>
  </section>
</header>
<section id="conocenos" class="project-container container">
  <div class="division"></div>
  <div class="content-text">
    <h2 style="color:green;"><b><u>¿Quiénes somos?</u></b></h2>
    <br>
    <p><b>Lufra 2020, C.A. es una empresa venezolana dedicada a la venta de aceites, filtros y misceláneos para vehículos livianos, camiones y maquinaria pesada. Con un enfoque en calidad, disponibilidad y atención personalizada, la empresa se ha consolidado como un proveedor confiable para transportistas, talleres y particulares que buscan soluciones rápidas y seguras para el mantenimiento de sus unidades.</b></p>
    <br>
    <p><b>Además de su amplio catálogo de productos —que incluye lubricantes certificados, filtros de aire, aceite y combustible, así como productos complementarios para el cuidado automotriz—, Lufra 2020, C.A. también ofrece servicios especializados de fabricación de mangueras hidráulicas a medida y cambios de aceite, brindando una atención integral que responde a las necesidades del sector automotor.</b></p>
    <br>
    <h2 style="color: green;"><b><u>Misión</u></b></h2>
    <br>
    <p><b>Ofrecer productos automotrices de alta calidad, especialmente aceites, filtros, misceláneos, mangueras hidráulicas y servicios de cambio de aceite, que garanticen el rendimiento y la durabilidad de vehículos livianos y pesados, brindando atención personalizada y soluciones confiables a nuestros clientes en todo el territorio nacional</b>.</p>
    <br>
    <h2 style="color: green;"><b><u>Visión</u></b></h2>
    <br>
    <p><b>Ser reconocidos como la empresa líder en el occidente venezolano en la distribución de repuestos automotrices y prestación de servicios técnicos, destacando por su responsabilidad, variedad de productos, asesoría técnica y compromiso con el mantenimiento seguro de cada vehículo</b>.</p>
  </div>
</section>
<section id="productos" class="project-container container">
  <div class="division"></div>
  <div class="content-text">
    <h2 style="color: green;"><b>Productos</b></h2>
    <p><b>Observa algunos de nuestros productos:</b></p>
  </div>
  <article class="project">
    <div href="" class="card">
      
      <div class="project-info">
        <div class="project-bio">
          <h3>Filtro de transmisión</h3>
          <p>AR94510</p>
        </div>
        <div class="project-link">
          <a href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CG5Kmp5H1Xq/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==%20%F0%9F%91%88%20" target="_blank"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.instagram.com/p/CG5Kmp5H1Xq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fas fa-globe"></i></a>
        </div>
      </div>
    </div>
    <div href="" class="card">
      
      <div class="project-info">
        <div class="project-bio">
          <h3>Filtro de combustible</h3>
          <p>RE62419</p>
        </div>
        <div class="project-link">
          <a href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CGdGsdnHSVW/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==" target="_blank"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.instagram.com/p/CGdGsdnHSVW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fas fa-globe"></i></a>
        </div>
      </div>
    </div>
    <div href="" class="card">
      
      <div class="project-info">
        <div class="project-bio">
          <h3>Filtro de aceite</h3>
          <p>RE504836</p>
        </div>
        <div class="project-link">
          <a href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CHX1DV1ngO0/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==" target="_blank"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.instagram.com/p/CHX1DV1ngO0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fas fa-globe"></i></a>
        </div>
      </div>
    </div>
    <div href="" class="card">
      <div class="project-info">
        <div class="project-bio">
          <h3>Filtro de aire</h3>
          <p>AL150288</p>
        </div>
        <div class="project-link">
          <a href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CHLgsxUH4Sc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.instagram.com/p/CHLgsxUH4Sc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fas fa-globe"></i></a>
        </div>
      </div>
    </div>
    <div href="" class="card">
        
      <div class="project-info">
        <div class="project-bio">
          <h3>Filtro de aceite hidráulico</h3>
          <p>AE43494</p>
        </div>
        <div class="project-link">
          <a href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CG-F2TNnf7S/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==://www.instagram.com/p/CHLgsxUH4Sc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.instagram.com/p/CG-F2TNnf7S/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fas fa-globe"></i></a>
        </div>
      </div>
    </div>
    <div href="" class="card">
      
      <div class="project-info">
        <div class="project-bio">
          <h3>Aceites</h3>
          <p>Mineral, Sintético,</p>
          <p>Semi-sintético</p>
        </div>
        <div class="project-link">
          <a href="https://api.whatsapp.com/send?phone=+584121542114&text=*Buen%20d%C3%ADa%20%F0%9F%91%8B%F0%9F%8F%8D%EF%B8%8F.%20Quiero%20mas%20informaci%C3%B3n%20sobre%20el%20siguiente%20producto:*%20%F0%9F%91%89https://www.instagram.com/p/CBoXoF5ntCq/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==" target="_blank"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.instagram.com/p/CBoXoF5ntCq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank"><i class="fas fa-globe"></i></a>
        </div>
      </div>
    </div>
  </article>
</section>
<footer id="footer">
  <div class="container">
    <a href="mailto:lufra2020ca@gmail.com" target="_blank"><b>lufra2020ca@gmail.com</b></a><br>
    <a href="https://wa.me/584121542114" target="_blank" style="color: green;"><b><u>Contáctanos aquí</u></b></a>
    <div class="social">
      <a href="https://www.instagram.com/lufra_2020?igsh=N3h6MWtjbTJha3ly" target="_blank">
        <img src="{{ asset('img/icons8-instagram-50.png') }}" alt="Instagram" />
      </a>
      <a href="https://wa.me/584245114575" target="_blank">
        <img src="{{ asset('img/icons8-whatsapp-50.png') }}" alt="WhatsApp" style="margin-left: 15px;" />
      </a>
    </div>
    <div class="attribution">
      <a href="https://github.com/CommunityPro/portfolio-html" target="_blank" rel="noopener noreferrer">
        <img src="https://user-images.githubusercontent.com/62628408/157202263-9174da24-b19a-4017-9b7c-a1d26ae8f014.svg" alt="attribution" width="150px" />
      </a>
    </div>
    <p>Copyright &copy; Communitypro <span id="datee"></span>, All rights reserved</p>
  </div>
</footer>
@endsection
