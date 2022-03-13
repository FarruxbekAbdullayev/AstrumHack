import { lazy } from 'react';
import { BiBookOpen, BiGroup, BiDumbbell, BiCreditCardAlt, BiCreditCard, BiCog, BiHourglass, BiScan, BiDesktop} from 'react-icons/bi';

const Attendances = lazy(() => import('../views/Attendances'));
const Course = lazy(() => import('../views/Course'));
const Students = lazy(() => import('../views/Students'));
const Payments = lazy(() => import('../views/Payments'));
const SignUp = lazy(() => import('../views/Auth/SignUp'));
const SignIn = lazy(() => import('../views/Auth/SignIn'));
const Settings = lazy(() => import('../views/Settings'));
const Profile = lazy(() => import('../views/Profile'));
const Expences = lazy(() => import('../views/Expences'));
const QRCode = lazy(() => import('../views/QRCode'));

export const MAIN_ROUTES = [
  {
    allowedRoles: ['admin', 'reception'],
    path: '/students',
    element: Students,
    icon: <BiGroup size={24} />,
    title: 'Students',
    hidden: false
  },
  {
    allowedRoles: ['admin', 'reception'],
    path: '/course',
    element: Course,
    icon: <BiBookOpen size={24} />,
    title: 'Courses',
    hidden: true
  },
  {
    allowedRoles: ['admin', 'reception'],
    path: '/payments',
    element: Payments,
    icon: <BiCreditCardAlt size={24} />,
    title: 'Payments',
    hidden: false
  },
  {
    allowedRoles: ['admin', 'reception'],
    path: '/expences',
    element: Expences,
    icon: <BiCreditCard size={24} />,
    title: 'Expences',
    hidden: false
  },
  {
    allowedRoles: ['admin', 'reception'],
    path: '/attendances',
    element: Attendances,
    icon: <BiHourglass size={24} />,
    title: 'Attendances',
    hidden: false
  },
  {
    allowedRoles: ['admin', 'reception'],
    path: '/qrcheck',
    element: QRCode,
    icon: <BiScan size={24} />,
    title: 'QRCode Check',
    hidden: false
  },
  {
    allowedRoles: ['admin', 'reception'],
    path: '/settings',
    element: Settings,
    icon: <BiCog size={24} />,
    title: 'Settings',
    hidden: false
  },
  {
    allowedRoles: ['admin', 'reception'],
    path: '/profile',
    element: Profile,
    icon: <BiCog size={24} />,
    title: 'Profile',
    hidden: true
  }
];

export const AUTH_ROUTES = [
  {
    path: '/qrcheck',
    element: QRCode
  },
  {
    path: '/sign-up',
    element: SignUp
  },
  {
    path: '/qrcode-scanner',
    element: QRCode,
    icon: <BiScan size={24} />,
    title: 'QRCode Scanner',
    hidden: false
  },
  {
    path: '*',
    element: SignIn
  }
];
