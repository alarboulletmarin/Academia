import { environment } from '../environments/environment';

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
    calendar: 'calendar',
    addAssignment: 'assignments/add',
    listAssignments: 'assignments',
    gradeAssignment: 'assignments/grade',
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
