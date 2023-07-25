const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/dashboard',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/dashboard',
            component: () => import('@/components/Screens/dashboard/index.vue')
        },
        {  
            name: 'Profile',
            path: '/profile',
            component: () => import('@/components/Screens/Profile/Profile.vue'),
            children:[
                {
                    name: 'Change Password',
                    path: '/profile/change-password',
                    component: () => import('@/components/Screens/Profile/ChangePassword.vue')
                },
                {
                    name: 'Change Electronic Signature',
                    path: '/profile/change-electronic-signature',
                    component: () => import('@/components/Screens/Profile/ChangeElectronicSignature.vue')
                },
                {
                    name: 'Population Group',
                    path: '/profile/population-group',
                    component: () => import('@/components/Screens/Profile/PopulationGroup.vue')
                },
                {
                    name: 'Speciality',
                    path: '/profile/speciality',
                    component: () => import('@/components/Screens/Profile/Specialty.vue')
                },
            ]
        },
        {
            name: 'Available Doctors',
            path: '/available_doctors',
            component: () => import('@/components/Screens/available_doctors/index.vue')
        },
        {
            name: 'Patients',
            path: '/patients',
            component: () => import('@/components/Screens/Patients/index.vue')
        },
        {
            name: 'Calender',
            path: '/calender',
            component: () => import('@/components/Screens/calender/index.vue')
        },
        {
            name: 'Problems',
            path: '/problems',
            component: () => import('@/components/Screens/problems/index.vue')
        },
        {
            name: 'Orders',
            path: '/orders',
            component: () => import('@/components/Screens/orders/index.vue')
        },
        {
            name: 'Labs',
            path: '/labs',
            component: () => import('@/components/Screens/labs/index.vue')
        },
        {
            name: 'Documents',
            path: '/docs',
            component: () => import('@/components/Screens/documents/index.vue')
        },
        {
            name: 'Notes',
            path: '/notes',
            component: () => import('@/components/Screens/notes/index.vue')
        },
        {
            name: 'Vitals',
            path: '/vitals',
            component: () => import('@/components/Screens/vitals/index.vue')
        },
        {
            name: 'Tracking',
            path: '/tracking',
            component: () => import('@/components/Screens/tracking/index.vue')
        },
        {
            name: 'Meetings',
            path: '/meetings',
            component: () => import('@/components/Screens/meetings/index.vue')
        },
        {
            name: 'Referrals',
            path: '/referrals',
            component: () => import('@/components/Screens/referrals/index.vue')
        },
        
        
    ]
};

export default MainRoutes;
// ['dashboard', 'patients', 'calender', 'problems', 'orders', 'vitals', 'notes', 'docs', 'labs', 'available_doctors', 'referrals', 'meetings', 'tracking']