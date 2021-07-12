const name = 'Errbit'

const n = (...args) => [ ...args, name ].join(' - ')

export default {
  Default: name,
  RouteHome: n('Apps'),
  RouteAppsNew: n('New App'),
  RouteAppsShow: vm => n(vm.app.Name, 'Apps'),
  RouteAppsEdit: vm => n(vm.app.Name, 'Edit App'),
  RouteAppsNotifications: vm => n(vm.app.Name, 'Notification'),
  RouteProblems: n('Errors'),
  RouteProblemsShow: vm => n(vm.notice.Message),
  RouteUsers: n('Users'),
  RouteUsersNew: n('New User'),
  RouteUsersEdit: n('Edit User'),
  RouteSignIn: n('Sign In'),
  RouteError: n('Error'),
  RouteNotFound: n('Page Not Found'),
}
