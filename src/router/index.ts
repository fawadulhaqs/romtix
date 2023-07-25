import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import Cookies from 'js-cookie';
import store from '@/store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            redirect: '/dashboard',
        },
        MainRoutes,
        AuthRoutes
    ]
});

router.beforeEach((to, from, next) => {

    // current page view title
    document.title = `EHR`;
    
    const isAuthenticated = !!(Cookies.get('token_id'));
    
    

    // before page access check if page requires authentication
    if (to.meta.requiresAuth) {

        if(isAuthenticated){
                next();
        }
        else{ next({ name: "Login" }); }
    } else {
        next();
    }
  
    // Scroll page to top on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

export default router;
