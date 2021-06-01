<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand"
          v-bind:to="{ name: 'RouteHome' }">Errbit</router-link>
        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link class="nav-link" active-class="active"
                v-bind:to="{ name: 'RouteHome' }">Apps</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="flex-shrink-0">
    <div class="container">
      <router-view></router-view>
    </div>
  </main>

  <footer class="footer mt-auto py-3 bg-light">
    <div class="container">
      <span class="text-muted"><a href="https://github.com/caiguanhao/goerrbit" target="_blank">goerrbit</a></span>
    </div>
  </footer>
</template>

<script>
</script>

<style>
main > .container {
  padding-top: 80px;
}
</style>
