<template>
  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand"
          v-bind:to="{ name: 'RouteHome' }">Errbit</router-link>
        <template v-if="currentUser.Id">
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
              <li class="nav-item">
                <router-link class="nav-link" active-class="active"
                  v-bind:to="{ name: 'RouteProblems' }">Errors</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" active-class="active"
                  v-bind:to="{ name: 'RouteUsers' }">Users</router-link>
              </li>
            </ul>
            <ul class="navbar-nav mb-2 mb-md-0">
              <li class="nav-item">
                <router-link v-bind:to="{ name: 'RouteUsersEdit', params: { id: currentUser.Id } }"
                  class="nav-link user-name">
                  <faicon class="me-2" icon="crown" title="User is an admin" v-if="currentUser.IsAdmin" />
                  <span v-text="currentUser.Name"></span>
                </router-link>
              </li>
              <li class="nav-item">
                <a href class="nav-link" v-on:click.prevent="signOut">Sign Out</a>
              </li>
            </ul>
          </div>
        </template>
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
      <a class="text-muted text-decoration-none small"
        href="https://github.com/caiguanhao/goerrbit"
        target="_blank" v-text="name"></a>
    </div>
  </footer>
</template>

<script>
import http from './http'

export default {
  computed: {
    name () {
      if (http.apiVersion.value) {
        return `goerrbit ${http.apiVersion.value}`
      }
      return 'goerrbit'
    }
  },
  methods: {
    signOut () {
      http.post('/sign-out').then(res => {
        if (window.sessionStorage) window.sessionStorage.removeItem('token')
        if (window.localStorage) window.localStorage.removeItem('token')
        let redirect = this.$route.fullPath
        if (redirect === '/') redirect = undefined
        this.$router.push({ name: 'RouteSignIn', query: { redirect } }).then(() => {
          this.$toast().success('Successfully signed out')
        })
      }, () => {
        this.$toast().error('Error signing out')
      })
    }
  },
  created () {
    let lastElem = null
    document.addEventListener('click', (e) => {
      if (!e.isTrusted) return
      let defer = () => lastElem = null
      // don't click the row if text is selected before mouse button is released
      if (window.getSelection().toString().length) {
        if (!e.shiftKey) {
          return defer()
        }
      }
      let el = e.target
      while (el) {
        let node = el.nodeName
        if (node === 'A' || node === 'BUTTON' || node === 'INPUT') {
          if (node === 'A' && el.getAttribute('href')) {
            let path = el.pathname + el.search + el.hash
            if (this.$route.fullPath === path) { // "reload" if clicking the same route
              this.$router.replace({
                name: 'RouteBlank'
              }).then(() => {
                this.$router.replace(path)
              })
            }
            return
          }
          if (e.shiftKey && clickBetween(lastElem, el)) return defer()
          lastElem = el
          return
        }
        if (el.classList && el.classList.contains('clickable-row')) {
          let elem = el.querySelector('.clickable-row-target') ||
            el.querySelector('input[type=checkbox]') ||
            el.querySelector('a')
          if (elem) elem.click() // click link or checkbox if row is clicked
          // if shift key is pressed, click checkboxes between two rows
          if (e.shiftKey && clickBetween(lastElem, elem)) return defer()
          lastElem = elem
          return
        }
        el = el.parentNode
      }
      return defer()
    })
  }
}

function clickBetween (a, b) {
  if (!a || !a.classList.contains('shift-key-select')) return false
  if (!b || !b.classList.contains('shift-key-select')) return false
  let selection = window.getSelection()
  if (selection.empty) selection.empty()
  else if (selection.removeAllRanges) selection.removeAllRanges()
  let all = document.querySelectorAll('.shift-key-select')
  let inRange = false
  for (let i = 0; i < all.length; i++) {
    if (all[i] === a || all[i] === b) {
      inRange = !inRange
      if (inRange) continue
      else break
    }
    if (inRange) setTimeout(() => all[i].click())
  }
  return true
}
</script>

<style>
main > .container {
  padding-top: 80px;
}

::-webkit-input-placeholder,
::placeholder {
  color: #d8dde2 !important;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background: #f1f1f1;
}

@keyframes background-fade-highlight {
  0% {
    background-color: #d1f0ff;
  }
  100% {
    background-color: transparent;
  }
}

.highlighted {
  animation: background-fade-highlight 2.5s ease-out;
}

.fake-input { /* this prevents autofill */
  position: absolute;
  left: -100%;
  opacity: 0;
}

.user-name {
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
