import { t } from '../utils';

export { default as COLORS } from './colors';
export * from './styling';

export const MEMBERSHIP_TYPES = {
  day: { label: t('Daily'), value: 'day' },
  month: { label: t('Monthly'), value: 'month' },
  year: { label: t('Yearly'), value: 'year' }
};

export const LANGUAGES = {
  uz: { label: t('Uzbek'), value: 'uz' },
  ru: { label: t('Russian'), value: 'ru' },
  en: { label: t('English'), value: 'en' }
};

export const PRODUCT_UNITS = {
  kg: { label: t('KG'), value: 'kg' },
  piece: { label: t('Piece'), value: 'piece' },
  gram: { label: t('Gram'), value: 'gram' },
};

export const ATTENDANCE_STATUS = {
  active: { label: t('Active'), value: 'active' },
  inactive: { label: t('Inactive'), value: 'inactive' }
};

export const ATTENDANCE_ACTIONS = {
  create: t('Add Attendance'),
  edite: t('Update Attendance')
};

export const MEMBER_ROLES = {
  admin: { label: t('Admin'), value: 'admin' },
  reception: { label: t('Reception'), value: 'reception' },
  member: { label: t('Member'), value: 'member' }, 
  trainer: { label: t('Trainer'), value: 'trainer' } 
};

export const PAYMENT_CATEGORY = {
  membership: { label: t('Membership'), value: 'membership' },
  product: { label: t('Product'), value: 'product' }
};

export const PAYMENT_METHODS = {
  cash: { label: t('Cash'), value: 'cash' },
  card: { label: t('Card'), value: 'card' },
  click: { label: t('Click/Payme'), value: 'click' },
};

export const PAYMENT_STATUS = {
  paid: { label: t('Paid'), value: 'paid' },
  pending: { label: t('Pending'), value: 'pending' },
  cancelled: { label: t('Cancelled'), value: 'cancelled' },
  refunded: { label: t('Refunded'), value: 'refunded' }
};

export const EXPENCE_TYPES = {
  cash: { label: t('Cash'), value: 'cash' },
  card: { label: t('Card'), value: 'card' },
  click: { label: t('Bank'), value: 'bank' },
};

export const EXPENCE_PURPOSES = {
  rent: { label: t('Rent'), value: 'rent' },
  salary: { label: t('Salary'), value: 'salary' },
  debt: { label: t('Debt'), value: 'debt' },
  bill: { label: t('Bill'), value: 'bill' },
  other: { label: t('Other'), value: 'other' },
};
