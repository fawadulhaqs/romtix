import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, TypographyIcon, UserPlusIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    {
      title: 'Dashboard',
      to: '/dashboard'
    },
    {
      title: 'Problems',
      to: '/problems'
    },
    {
      title: 'Patients',
      to: '/patients'
    },
    {
      title: 'Calendar',
      to: '/calender'
    },
    // {
    //   title: 'Referrals',
    //   children: [
    //     {
    //       title: 'Available Doctors',
    //       to: '/available_doctors'
    //     },
    //     {
    //       title: 'Referred Patient',
    //       to: 'referred_patient'
    //     },
    //   ]
    // },
    // {
    //   title: 'Schedule',
    //   to: '/Schedule'
    // },
    {
      title: 'Orders',
      to: '/orders'
    },
    {
      title: 'Vitals',
      to: '/vitals'
    },
    {
      title: 'Notes',
      to: '/notes'
    },
    // {
    //   title: 'Documents',
    //   children: [
    //     {
    //       title: 'Patient Documents',
    //       to: '/patient_docs'
    //     },
    //     {
    //       title: 'Forms',
    //       to: '/forms'
    //     },
    //   ]
    // },
    {
      title: 'Labs',
      to: 'labs'
    },
    {
      title: 'User Profile',
      to: 'profile'
    },
    // {
    //   title: 'Meeting Rooms',
    //   to: '/meeting_rooms'
    // },
    // {
    //   title: 'Hours Tracking',
    //   children: [
    //     {
    //       title: 'RPA',
    //       to: '/rpa'
    //     },
    //     {
    //       title: 'MFT/LCSW/APCC',
    //       to: '/mft-lcsw-apcc'
    //     },
    //   ]
    // },
    // {
    //   title: 'Billing',
    //   children: [
    //     {
    //       title: 'claims',
    //       to: '/claims'
    //     },
    //     {
    //       title: 'Co-Pays',
    //       to: '/co_pays'
    //     },
    //     {
    //       title: 'Reports',
    //       to: '/reports'
    //     },
    //     {
    //       title: 'CPT Count',
    //       to: '/cpt_count'
    //     },
    //     {
    //       title: 'Hours Tracking',
    //       to: '/tracking'
    //     },
    //   ]
    // },
    // {
    //   title: 'Reports',
    //   to: '/Schedule'
    // },
    // {
    //   title: 'Manage',
    //   to: '/Schedule'
    // },
  ];

export default sidebarItem;
