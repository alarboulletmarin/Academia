import {environment} from '../environments/environment';

/**
 * Constants used in the application.
 */
export const APP_CONSTANTS = {
  colors: {},
  faIcon: {},
  endpoints: {
    auth: {
      login: `${environment.apiURL}/users/login`,
    },
  },
  routerLinks: {
    home: '',
    addAssignment: 'assignments/add',
    listAssignments: 'assignments',
    generateAssignments: 'assignments/generate',
    auth: 'login',
    users: 'users',
  },
  hearders: {
    /**
     * Header key for authentication token.
     */
    token: 'x-auth-token',
  },
};
