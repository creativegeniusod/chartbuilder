var isEmpty = require("lodash/isEmpty");
var createStore = require("fluxible/addons/createStore");
var assign = require("lodash/assign");

var AuthStore = createStore({
    storeName: "AuthStore",
    handlers: {
		LOAD_SESSION: "loadSession",
		LOGIN_START: "loginStart",
		LOGIN_SUCCESS: "login",
		LOGIN_ERROR: "loginError",
		LOGOUT_START: "logoutStart",
		LOGOUT_SUCCESS: "logout",
		LOGOUT_ERROR: "logoutError",
		USER_CREATED: "userCreated",
		USER_CREATE_ERROR: "userCreateError",
		RECEIVE_USER_PERMISSIONS: "setUserPermissions",
		RECEIVE_USER_ORGANIZATION_STYLES: "setUserOrgStyles",
		USERNAME_SAVED: "saveUsername",
		CREATE_USERNAME_ERROR: "userCreateUsernameError",
		RESET_EMAIL_REQUESTED: "resetPasswordEmailRequested",
		RESET_EMAIL_SENT: "resetPasswordEmailSent",
		RESET_EMAIL_ERROR: "resetPasswordEmailError",
		PASSWORD_RESET_OK: "passwordResetOK",
		PASSWORD_RESET_ERROR: "passwordResetError",
		PROFILE_EDITED: "updateProfile",
		PROFILE_EDIT_ERROR: "updateProfileError",
		PROFILE_IMAGE_SAVED: "updateProfile",
		PASSWORD_CHANGED: "passwordChanged",
		CHANGE_PASSWORD_ERROR: "passwordChangedError",
		RECEIVE_USER_DRAFT_COUNT: "userDraftCount",
		ORG_INVITE_RECEIVE: "orgInviteRecieve",
		ORG_INVITE_ERROR: "orgInviteError",
		ORG_INVITE_CONFIRM: "orgInviteConfirm"
	},
	initialize: function() {
		this.user = {}, this.userPermissions = {}, this.loggingIn = !1, this.loggingOut = !1, this.authError = null, this.createError = !1, this.resettingPassword = !1, this.resettingPasswordError = null, this.resetPasswordRequestEmail = null, this.passwordWasReset = !1, this.passwordWasChanged = !1, this.profileWasEdited = !1, this.profileEditError = null, this.changePasswordError = null, this.resetPasswordError = null, this.migratingFromPrism = !1, this.createUsernameError = !1, this.orgInvite = void 0, this.orgInviteErrors = void 0, this.orgInviteConfirmed = !1
	},
	csrfError: "We encountered a problem. Please refresh your browser window and try again.",
	loadSession: function(e) {
		this.user = e.user, this.emitChange()
	},
	loginStart: function() {
		this.loggingIn = !0, this.authError = null, this.emitChange()
	},
	login: function(e) {
		this.loggingIn = !1, this.authError = null, this.user = e.user, this.emitChange()
	},
	loginError: function(e) {
		this.loggingIn = !1, 401 === e.status ? this.authError = e.response.body ? e.response.body.message : "Error logging into Atlas - username and/or password were invalid." : this.authError = this.csrfError, this.emitChange()
	},
	setUserPermissions: function(e) {
		this.userPermissions = e.body, this.emitChange()
	},
	getUserPermissions: function() {
		return this.userPermissions
	},
	setUserOrgStyles: function(e) {
		this.user.organizationStyles = e.styles, this.emitChange()
	},
	logoutStart: function() {
		this.loggingOut = !0, this.emitChange()
	},
	logout: function() {
		this.loggingOut = !1, this.user = {}, this.emitChange()
	},
	logoutError: function(e) {
		this.loggingOut = !1, this.emitChange()
	},
	userCreated: function(e) {
		this.user = e.body.user, this.loggingIn = !1, this.authError = null, this.emitChange()
	},
	userCreateError: function(e) {
		var t, n, r = e.response.text;
		n = "Unable to register user: ", r.toString().indexOf("duplicate") !== -1 ? (t = r.indexOf("email") === -1 ? "username" : "email address", n += "This " + t + " has already been taken.", n += r.toString().indexOf("email") !== -1 ? ' Please click "login" above to login with this email.' : " Please choose a different username.") : n += " the system encountered a problem. Please refresh your browser and try again.", this.createError = n, this.emitChange()
	},
	saveUsername: function(e) {
		this.user = e.user, this.emitChange()
	},
	userCreateUsernameError: function(e) {
		this.createUsernameError = e, this.emitChange()
	},
	resetPasswordEmailRequested: function(e) {
		this.resetPasswordRequestEmail = e, this.emitChange()
	},
	resetPasswordEmailSent: function(e) {
		e.success && e.success === !0 && (this.resettingPassword = !0, this.emitChange())
	},
	resetPasswordEmailError: function(e) {
		var t;
		e.response && e.response.body && null !== e.response.body.error ? (t = e.response.body.error, t.indexOf("not found") !== -1 && (t += ": This email address was not found in our database."), this.resettingPasswordError = t) : e.response.text.indexOf("tampered") !== -1 ? this.resettingPasswordError = this.csrfError : this.resettingPasswordError = e, this.emitChange()
	},
	passwordResetOK: function(e) {
		this.passwordWasReset = !0, "undefined" != typeof e.migrated && (this.migratingFromPrism = !0), this.emitChange()
	},
	updateProfile: function(e) {
		this.profileWasEdited = !0, this.user = assign(this.user, e.user), this.profileEditError = null, this.emitChange()
	},
	updateProfileError: function(e) {
		this.profileEditError = e.err, this.emitChange()
	},
	passwordChanged: function(e) {
		this.passwordWasChanged = !0, this.changePasswordError = null, this.user = e, this.emitChange()
	},
	passwordChangedError: function(e) {
		this.changePasswordError = e.response.body.error, this.emitChange()
	},
	passwordResetError: function(e) {
		this.resetPasswordError = e, this.emitChange()
	},
	userDraftCount: function(e) {
		this.user.draftsCount = e.body.count, this.emitChange()
	},
	orgInviteRecieve: function(e) {
		this.orgInviteConfirmed = !1, this.orgInvite = e, this.orgInviteErrors = void 0, this.emitChange()
	},
	orgInviteError: function(e) {
		this.orgInviteErrors = e, this.orgInviteConfirmed = !1, this.emitChange()
	},
	orgInviteConfirm: function(e) {
		this.orgInviteConfirmed = !0, this.orgInviteErrors = void 0, this.user = e, this.emitChange()
	},
	isAuth: function() {
		return !isEmpty(this.user)
	},
	getError: function() {
		return this.authError
	},
	getUser: function() {
		return this.user
	},
	getCreateError: function() {
		return this.createError
	},
	getCreateUsernameError: function() {
		return this.createUsernameError
	},
	dehydrate: function() {
		return {
			user: this.user,
			loggingIn: this.loggingIn,
			loggingOut: this.loggingOut,
			userPermissions: this.userPermissions,
			authError: this.authError,
			createError: this.createError,
			createUsernameError: this.createUsernameError,
			orgInvite: this.orgInvite,
			orgInviteErrors: this.orgInviteErrors,
			orgInviteConfirmed: this.orgInviteConfirmed
		}
	},
	rehydrate: function(e) {
		this.user = e.user, this.userPermissions = e.userPermissions, this.loggingIn = e.loggingIn, this.loggingOut = e.loggingOut, this.authError = e.authError, this.createError = e.createError, this.createUsernameError = e.createUsernameError, this.orgInvite = e.orgInvite, this.orgInviteErrors = e.orgInviteErrors, this.orgInviteConfirmed = e.orgInviteConfirmed
	}
});

module.exports = AuthStore;
